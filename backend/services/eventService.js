import { Op } from 'sequelize';
import { Event, Program, User, Zone, Attendance, Feedback, Member } from '../models/index.js';
import { config } from '../config/environment.js';
import { logger } from '../utils/logger.js';
import { generateQRData } from '../utils/helpers.js';
import { EVENT_STATUS } from '../config/constants.js';

export const eventService = {
  async create(data) {
    const conflictCheck = await this.checkConflict(
      data.eventDate, 
      data.eventTime, 
      data.durationMinutes
    );
    
    if (conflictCheck.hasConflict) {
      throw new Error(`Conflicting event detected: ${conflictCheck.conflicts[0].title}`);
    }
    
    const qrData = generateQRData(config.qrCode.namespace, require('uuid').v4());
    
    const event = await Event.create({
      ...data,
      qrCodeData: qrData,
      status: EVENT_STATUS.DRAFT
    });
    
    logger.log('Event created', { eventId: event.id, title: event.title });
    
    return event;
  },

  async findAll(filters = {}) {
    const where = {};
    
    if (filters.status) where.status = filters.status;
    if (filters.programId) where.programId = filters.programId;
    if (filters.zoneId) where.zoneId = filters.zoneId;
    if (filters.dateFrom || filters.dateTo) {
      where.eventDate = {};
      if (filters.dateFrom) where.eventDate[Op.gte] = filters.dateFrom;
      if (filters.dateTo) where.eventDate[Op.lte] = filters.dateTo;
    }
    
    const { limit, offset } = filters;
    
    const events = await Event.findAll({
      where,
      include: [
        { model: Program, as: 'program', attributes: ['id', 'name', 'type'] },
        { model: User, as: 'organizer', attributes: ['id', 'name'] },
        { model: Zone, as: 'zone', attributes: ['id', 'name'] }
      ],
      order: [['eventDate', 'ASC'], ['eventTime', 'ASC']],
      limit,
      offset
    });
    
    const total = await Event.count({ where });
    
    const eventsWithCount = await Promise.all(
      events.map(async (event) => {
        const attendanceCount = await Attendance.count({
          where: { eventId: event.id }
        });
        return {
          ...event.toJSON(),
          attendanceCount
        };
      })
    );
    
    return { events: eventsWithCount, total, limit, offset };
  },

  async findById(eventId) {
    const event = await Event.findByPk(eventId, {
      include: [
        { model: Program, as: 'program', attributes: ['id', 'name', 'type'] },
        { model: User, as: 'organizer', attributes: ['id', 'name'] },
        { model: Zone, as: 'zone', attributes: ['id', 'name'] }
      ]
    });
    
    if (!event) return null;
    
    const attendance = await Attendance.findAll({
      where: { eventId },
      include: [
        { model: Member, as: 'member', attributes: ['id', 'name'] }
      ]
    });
    
    const feedback = await Feedback.findAll({
      where: { eventId },
      include: [
        { model: Member, as: 'member', attributes: ['id', 'name'] }
      ]
    });
    
    return {
      ...event.toJSON(),
      attendees: attendance.map(a => ({
        id: a.member.id,
        name: a.member.name,
        checkedInAt: a.checkedInAt
      })),
      attendanceCount: attendance.length,
      feedback: feedback.map(f => ({
        id: f.id,
        rating: f.rating,
        sentiment: f.sentiment,
        text: f.textFeedback
      }))
    };
  },

  async update(eventId, data) {
    const event = await Event.findByPk(eventId);
    if (!event) throw new Error('Event not found');
    
    if (data.eventDate || data.eventTime || data.durationMinutes) {
      const conflictCheck = await this.checkConflict(
        data.eventDate || event.eventDate,
        data.eventTime || event.eventTime,
        data.durationMinutes || event.durationMinutes,
        eventId
      );
      
      if (conflictCheck.hasConflict) {
        throw new Error('Conflicting event detected');
      }
    }
    
    await event.update(data);
    
    logger.log('Event updated', { eventId });
    
    return event;
  },

  async delete(eventId) {
    const event = await Event.findByPk(eventId);
    if (!event) throw new Error('Event not found');
    
    await event.destroy();
    
    logger.log('Event deleted', { eventId });
    
    return { message: 'Event deleted successfully' };
  },

  async publish(eventId) {
    const event = await Event.findByPk(eventId);
    if (!event) throw new Error('Event not found');
    
    await event.update({
      status: EVENT_STATUS.PUBLISHED,
      publishedAt: new Date()
    });
    
    logger.log('Event published', { eventId, title: event.title });
    
    let notificationsSent = 0;
    if (event.notifyAll || event.notifyBeneficiaries || event.notifyMentors) {
      const members = await Member.findAll({
        where: { status: 'active' }
      });
      notificationsSent = members.length;
    }
    
    return {
      id: event.id,
      status: event.status,
      notificationsSent
    };
  },

  async checkConflict(eventDate, eventTime, duration, excludeEventId = null) {
    const [hours, minutes] = eventTime.split(':');
    const startMinutes = parseInt(hours) * 60 + parseInt(minutes);
    const endMinutes = startMinutes + duration;
    
    const conflictingEvents = await Event.findAll({
      where: {
        eventDate: eventDate,
        status: { [Op.ne]: 'archived' },
        ...(excludeEventId && { id: { [Op.ne]: excludeEventId } })
      }
    });
    
    const hasConflict = conflictingEvents.some(e => {
      const [h, m] = e.eventTime.split(':');
      const otherStart = parseInt(h) * 60 + parseInt(m);
      const otherEnd = otherStart + e.durationMinutes;
      
      return (startMinutes - 30 < otherEnd) && (endMinutes + 30 > otherStart);
    });
    
    return { hasConflict, conflicts: conflictingEvents };
  },

  async getUpcomingCount() {
    const today = new Date().toISOString().split('T')[0];
    return Event.count({
      where: {
        eventDate: { [Op.gte]: today },
        status: EVENT_STATUS.PUBLISHED
      }
    });
  }
};
