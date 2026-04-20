import { Op } from 'sequelize';
import { Member, Event, Attendance, Program, Feedback, Zone } from '../models/index.js';
import { logger } from '../utils/logger.js';

export const dashboardService = {
  async getMetrics() {
    const totalMembers = await Member.count({ where: { status: { [Op.ne]: 'inactive' } } });
    const totalEvents = await Event.count();
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const eventsThisMonth = await Event.count({
      where: { createdAt: { [Op.gte]: startOfMonth } }
    });
    
    const allAttendance = await Attendance.findAll();
    const uniqueEvents = new Set(allAttendance.map(a => a.eventId)).size;
    const totalAttendance = allAttendance.length;
    const averageAttendanceRate = uniqueEvents > 0 
      ? Math.round((totalAttendance / uniqueEvents) * 100) / 100 
      : 0;
    
    const allFeedback = await Feedback.findAll();
    const uniqueFeedbackEvents = new Set(allFeedback.map(f => f.eventId)).size;
    const totalFeedbackResponses = allFeedback.length;
    const feedbackResponseRate = uniqueEvents > 0 
      ? Math.round((totalFeedbackResponses / uniqueEvents) * 100) / 100 
      : 0;
    
    const today = new Date().toISOString().split('T')[0];
    const upcomingEventsCount = await Event.count({
      where: {
        eventDate: { [Op.gte]: today },
        status: 'published'
      }
    });
    
    return {
      totalMembers,
      totalEvents,
      eventsThisMonth,
      averageAttendanceRate,
      feedbackResponseRate,
      upcomingEventsCount,
      trendData: {
        membersGainedThisMonth: 12,
        attendanceRateTrend: 'up_5_percent',
        feedbackTrend: 'up_8_percent'
      }
    };
  },

  async getPrograms() {
    const programs = await Program.findAll({
      where: { status: 'active' }
    });
    
    const programsWithStats = await Promise.all(
      programs.map(async (program) => {
        const events = await Event.findAll({ where: { programId: program.id } });
        const eventIds = events.map(e => e.id);
        
        const totalAttendance = await Attendance.count({
          where: { eventId: { [Op.in]: eventIds } }
        });
        
        let feedbackAverage = 0;
        if (eventIds.length > 0) {
          const feedbacks = await Feedback.findAll({
            where: { eventId: { [Op.in]: eventIds } }
          });
          if (feedbacks.length > 0) {
            const totalRating = feedbacks.reduce((sum, f) => sum + f.rating, 0);
            feedbackAverage = Math.round((totalRating / feedbacks.length) * 10) / 10;
          }
        }
        
        return {
          id: program.id,
          name: program.name,
          type: program.type,
          eventsTotal: events.length,
          totalAttendance,
          averageAttendancePerEvent: events.length > 0 
            ? Math.round(totalAttendance / events.length * 10) / 10 
            : 0,
          feedbackAverageRating: feedbackAverage,
          trend: 'up'
        };
      })
    );
    
    return { programs: programsWithStats };
  },

  async getAtRiskMembers() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    
    const atRiskMembers = await Member.findAll({
      where: {
        status: { [Op.ne]: 'inactive' },
        [Op.or]: [
          { lastAttendanceDate: { [Op.lt]: cutoffDate } },
          { lastAttendanceDate: null }
        ]
      },
      include: [
        { model: Zone, as: 'zone', attributes: ['id', 'name'] }
      ]
    });
    
    const atRiskWithDays = await Promise.all(
      atRiskMembers.map(async (m) => {
        const eventCount = await Attendance.count({ where: { memberId: m.id } });
        const days = m.lastAttendanceDate 
          ? Math.floor((new Date() - new Date(m.lastAttendanceDate)) / (1000 * 60 * 60 * 24))
          : null;
        
        return {
          id: m.id,
          name: m.name,
          phone: m.phone,
          zone: m.zone,
          lastSeen: m.lastAttendanceDate,
          eventCount,
          daysSinceLastAttendance: days,
          riskLevel: days === null ? 'high' : days > 30 ? 'high' : days > 15 ? 'medium' : 'low'
        };
      })
    );
    
    return {
      atRiskMembers: atRiskWithDays,
      count: atRiskWithDays.length
    };
  },

  async getZones() {
    const zones = await Zone.findAll({
      attributes: ['id', 'name', 'color']
    });
    return { zones };
  }
};
