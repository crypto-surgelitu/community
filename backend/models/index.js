import { sequelize } from '../config/database.js';
import User from './User.js';
import Zone from './Zone.js';
import Program from './Program.js';
import Member from './Member.js';
import Event from './Event.js';
import Attendance from './Attendance.js';
import Feedback from './Feedback.js';
import Template from './Template.js';
import MessageLog from './MessageLog.js';

User.hasMany(Program, { foreignKey: 'createdBy', as: 'programs' });
Program.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Event, { foreignKey: 'organizerId', as: 'organizedEvents' });
Event.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });

Zone.hasMany(Member, { foreignKey: 'zoneId', as: 'members' });
Member.belongsTo(Zone, { foreignKey: 'zoneId', as: 'zone' });

User.hasMany(Member, { foreignKey: 'createdBy', as: 'createdMembers' });
Member.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Program.hasMany(Event, { foreignKey: 'programId', as: 'events' });
Event.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

Zone.hasMany(Event, { foreignKey: 'zoneId', as: 'events' });
Event.belongsTo(Zone, { foreignKey: 'zoneId', as: 'zone' });

Event.hasMany(Attendance, { foreignKey: 'eventId', as: 'attendance' });
Attendance.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

Member.hasMany(Attendance, { foreignKey: 'memberId', as: 'attendance' });
Attendance.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

User.hasMany(Attendance, { foreignKey: 'checkedInBy', as: 'checkIns' });
Attendance.belongsTo(User, { foreignKey: 'checkedInBy', as: 'checkedInByUser' });

Event.hasMany(Feedback, { foreignKey: 'eventId', as: 'feedback' });
Feedback.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

Member.hasMany(Feedback, { foreignKey: 'memberId', as: 'feedback' });
Feedback.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

Event.hasMany(MessageLog, { foreignKey: 'eventId', as: 'messageLogs' });
MessageLog.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

Member.hasMany(MessageLog, { foreignKey: 'recipientMemberId', as: 'receivedMessages' });
MessageLog.belongsTo(Member, { foreignKey: 'recipientMemberId', as: 'recipientMember' });

User.hasMany(MessageLog, { foreignKey: 'senderUserId', as: 'sentMessages' });
MessageLog.belongsTo(User, { foreignKey: 'senderUserId', as: 'senderUser' });

User.hasMany(Template, { foreignKey: 'createdBy', as: 'templates' });
Template.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

export {
  sequelize,
  User,
  Zone,
  Program,
  Member,
  Event,
  Attendance,
  Feedback,
  Template,
  MessageLog
};
