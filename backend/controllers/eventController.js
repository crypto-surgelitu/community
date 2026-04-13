import { eventService } from '../services/eventService.js';
import { Event, Attendance, Member } from '../models/index.js';

export const eventController = {
  async create(req, res, next) {
    try {
      const event = await eventService.create(req.validatedBody);
      res.status(201).json(event);
    } catch (error) {
      if (error.message.includes('Conflicting')) {
        res.status(400).json({ error: error.message, status: 400 });
      } else {
        next(error);
      }
    }
  },

  async findAll(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        programId: req.query.program,
        zoneId: req.query.zone,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        limit: parseInt(req.query.limit) || 20,
        offset: parseInt(req.query.offset) || 0
      };
      
      const result = await eventService.findAll(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async findById(req, res, next) {
    try {
      const event = await eventService.findById(req.params.eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found', status: 404 });
      }
      res.status(200).json(event);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const event = await eventService.update(req.params.eventId, req.body);
      res.status(200).json(event);
    } catch (error) {
      if (error.message === 'Event not found' || error.message.includes('Conflicting')) {
        res.status(400).json({ error: error.message, status: 400 });
      } else {
        next(error);
      }
    }
  },

  async delete(req, res, next) {
    try {
      const result = await eventService.delete(req.params.eventId);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Event not found') {
        res.status(404).json({ error: error.message, status: 404 });
      } else {
        next(error);
      }
    }
  },

  async publish(req, res, next) {
    try {
      const result = await eventService.publish(req.params.eventId);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Event not found') {
        res.status(404).json({ error: error.message, status: 404 });
      } else {
        next(error);
      }
    }
  },

  async checkIn(req, res, next) {
    try {
      const { eventId } = req.params;
      const { memberId, checkInMethod } = req.validatedBody;
      
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found', status: 404 });
      }
      
      const member = await Member.findByPk(memberId);
      if (!member) {
        return res.status(404).json({ error: 'Member not found', status: 404 });
      }
      
      const existingAttendance = await Attendance.findOne({
        where: { eventId, memberId }
      });
      
      if (existingAttendance) {
        return res.status(400).json({ error: 'Member already checked in', status: 400 });
      }
      
      const attendance = await Attendance.create({
        eventId,
        memberId,
        checkedInAt: new Date(),
        checkedInBy: req.user.id,
        checkInMethod: checkInMethod || 'qr_scan'
      });
      
      const checkedInCount = await Attendance.count({ where: { eventId } });
      
      res.status(201).json({
        attendanceId: attendance.id,
        memberName: member.name,
        checkedInAt: attendance.checkedInAt,
        totalCheckedIn: checkedInCount,
        maxCapacity: event.maxCapacity
      });
    } catch (error) {
      next(error);
    }
  },

  async getAttendance(req, res, next) {
    try {
      const { eventId } = req.params;
      
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found', status: 404 });
      }
      
      const attendance = await Attendance.findAll({
        where: { eventId },
        include: [
          { model: Member, as: 'member', attributes: ['id', 'name'] }
        ],
        order: [['checkedInAt', 'ASC']]
      });
      
      const allMembers = await Member.findAll({ where: { status: 'active' } });
      const checkedInMemberIds = attendance.map(a => a.memberId);
      const notCheckedIn = allMembers.filter(m => !checkedInMemberIds.includes(m.id));
      
      res.status(200).json({
        eventId,
        totalCapacity: event.maxCapacity,
        checkedIn: attendance.map(a => ({
          id: a.member.id,
          name: a.member.name,
          checkedInAt: a.checkedInAt ? a.checkedInAt.toTimeString().slice(0, 5) : null,
          checkInMethod: a.checkInMethod
        })),
        checkedInCount: attendance.length,
        notCheckedIn: notCheckedIn.map(m => ({
          id: m.id,
          name: m.name
        })),
        notCheckedInCount: notCheckedIn.length
      });
    } catch (error) {
      next(error);
    }
  }
};
