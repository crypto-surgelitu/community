import { Op } from 'sequelize';
import { Member, Attendance, Event, Zone, User, Feedback, MessageLog } from '../models/index.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/environment.js';
import { MEMBER_ENGAGEMENT, AT_RISK_DAYS } from '../config/constants.js';

export const memberService = {
  async create(data) {
    const existingMember = await Member.findOne({ where: { phone: data.phone } });
    if (existingMember) {
      throw new Error('Member with this phone number already exists');
    }
    
    const member = await Member.create(data);
    
    logger.log('Member created', { memberId: member.id, name: member.name });
    
    return member;
  },

  async findAll(filters = {}) {
    const where = {};
    
    if (filters.zoneId) where.zoneId = filters.zoneId;
    if (filters.engagement) where.engagementLevel = filters.engagement;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filters.search}%` } },
        { phone: { [Op.like]: `%${filters.search}%` } }
      ];
    }
    
    const { limit, offset } = filters;
    
    const members = await Member.findAll({
      where,
      include: [
        { model: Zone, as: 'zone', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    const total = await Member.count({ where });
    
    const membersWithStats = await Promise.all(
      members.map(async (member) => {
        const eventsAttended = await Attendance.count({
          where: { memberId: member.id }
        });
        return {
          ...member.toJSON(),
          eventsAttended
        };
      })
    );
    
    return { members: membersWithStats, total, limit, offset };
  },

  async findById(memberId) {
    const member = await Member.findByPk(memberId, {
      include: [
        { model: Zone, as: 'zone', attributes: ['id', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'name'] }
      ]
    });
    
    if (!member) return null;
    
    const eventsAttended = await Attendance.count({
      where: { memberId }
    });
    
    const timeline = await this.getTimeline(memberId);
    
    return {
      ...member.toJSON(),
      eventsAttended,
      timeline
    };
  },

  async update(memberId, data) {
    const member = await Member.findByPk(memberId);
    if (!member) throw new Error('Member not found');
    
    if (data.phone && data.phone !== member.phone) {
      const existing = await Member.findOne({ where: { phone: data.phone } });
      if (existing) {
        throw new Error('Phone number already in use');
      }
    }
    
    await member.update(data);
    
    logger.log('Member updated', { memberId });
    
    return member;
  },

  async delete(memberId) {
    const member = await Member.findByPk(memberId);
    if (!member) throw new Error('Member not found');
    
    await member.destroy();
    
    logger.log('Member deleted', { memberId });
    
    return { message: 'Member deleted successfully' };
  },

  async bulkImport(membersData, userId) {
    const maxImport = config.features.maxMembersPerImport;
    if (membersData.length > maxImport) {
      throw new Error(`Maximum ${maxImport} members per import`);
    }
    
    // Preload zones for name->ID mapping
    const zones = await Zone.findAll({ attributes: ['id', 'name'] });
    const zoneMap = {};
    zones.forEach(z => {
      if (z.name) zoneMap[z.name.toLowerCase()] = z.id;
    });
    
    const results = { imported: 0, failed: 0, errors: [] };
    
    for (const rawData of membersData) {
      try {
        // Normalize keys to lowercase (handle CSV header casing)
        const memberData = {};
        Object.keys(rawData).forEach(key => {
          const lower = key.toLowerCase();
          memberData[lower] = rawData[key];
        });
        
        // Resolve zone name to zoneId if zone provided without zoneId
        if (memberData.zone && !memberData.zoneId) {
          const zoneId = zoneMap[memberData.zone.toLowerCase()];
          if (zoneId) {
            memberData.zoneId = zoneId;
          } else {
            throw new Error(`Zone "${memberData.zone}" not found`);
          }
        }
        // Remove zone field (not a column)
        delete memberData.zone;
        
        const existing = await Member.findOne({ where: { phone: memberData.phone } });
        if (existing) {
          throw new Error(`Phone ${memberData.phone} already exists`);
        }
        
        // Only take allowed fields
        const { name, phone, email, zoneId } = memberData;
        await Member.create({
          name,
          phone,
          email: email || null,
          zoneId,
          createdBy: userId
        });
        
        results.imported++;
      } catch (error) {
        results.failed++;
        results.errors.push(`${error.message}`);
      }
    }
    
    logger.log('Bulk import completed', results);
    
    return results;
  },

  async getTimeline(memberId) {
    const attendance = await Attendance.findAll({
      where: { memberId },
      include: [
        { 
          model: Event, 
          as: 'event',
          attributes: ['id', 'title', 'eventDate']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    
    const timeline = await Promise.all(
      attendance.map(async (a) => {
        let feedback = null;
        if (a.event) {
          feedback = await Feedback.findOne({
            where: { eventId: a.event.id, memberId }
          });
        }
        
        return {
          id: a.id,
          type: 'event_attended',
          eventName: a.event?.title,
          eventDate: a.event?.eventDate,
          attended: true,
          feedback: feedback ? {
            rating: feedback.rating,
            sentiment: feedback.sentiment,
            text: feedback.textFeedback
          } : null
        };
      })
    );
    
    return timeline;
  },

  async calculateEngagementLevel(memberId) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const attendanceCount = await Attendance.count({
      where: {
        memberId,
        checkedInAt: { [Op.gte]: sixMonthsAgo }
      }
    });
    
    let level = MEMBER_ENGAGEMENT.LOW;
    if (attendanceCount >= 10) level = MEMBER_ENGAGEMENT.HIGH;
    else if (attendanceCount >= 5) level = MEMBER_ENGAGEMENT.MEDIUM;
    
    const lastAttendance = await Attendance.findOne({
      where: { memberId },
      order: [['checkedInAt', 'DESC']]
    });
    
    await Member.update(
      {
        engagementLevel: level,
        lastAttendanceDate: lastAttendance?.checkedInAt
      },
      { where: { id: memberId } }
    );
    
    return level;
  },

  async identifyAtRiskMembers() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - AT_RISK_DAYS);
    
    const atRiskMembers = await Member.findAll({
      where: {
        status: 'active',
        [Op.or]: [
          { lastAttendanceDate: { [Op.lt]: cutoffDate } },
          { lastAttendanceDate: null }
        ]
      }
    });
    
    if (atRiskMembers.length > 0) {
      await Member.update(
        { status: 'at_risk' },
        { where: { id: atRiskMembers.map(m => m.id) } }
      );
    }
    
    return atRiskMembers.map(m => ({
      id: m.id,
      name: m.name,
      phone: m.phone,
      lastAttendance: m.lastAttendanceDate,
      daysSinceLastAttendance: m.lastAttendanceDate 
        ? Math.floor((new Date() - new Date(m.lastAttendanceDate)) / (1000 * 60 * 60 * 24))
        : null,
      riskLevel: m.lastAttendanceDate 
        ? (Math.floor((new Date() - new Date(m.lastAttendanceDate)) / (1000 * 60 * 60 * 24)) > 30 ? 'high' : 'medium')
        : 'high'
    }));
  },

  async sendMessage(memberId, messageContent, templateId, senderUserId) {
    const member = await Member.findByPk(memberId);
    if (!member) throw new Error('Member not found');
    
    const messageLog = await MessageLog.create({
      recipientMemberId: memberId,
      senderUserId,
      messageContent,
      messageType: 'whatsapp',
      status: 'pending'
    });
    
    logger.log('Message queued', { messageId: messageLog.id, memberId });
    
    return {
      messageId: messageLog.id,
      status: 'pending',
      recipient: member.name,
      message: messageContent
    };
  }
};
