import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  programId: {
    type: DataTypes.UUID,
    field: 'program_id',
    allowNull: false
  },
  organizerId: {
    type: DataTypes.UUID,
    field: 'organizer_id',
    allowNull: false
  },
  zoneId: {
    type: DataTypes.UUID,
    field: 'zone_id',
    allowNull: true
  },
  eventDate: {
    type: DataTypes.DATEONLY,
    field: 'event_date',
    allowNull: false
  },
  eventTime: {
    type: DataTypes.TIME,
    field: 'event_time',
    allowNull: false
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    field: 'duration_minutes',
    defaultValue: 120
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  maxCapacity: {
    type: DataTypes.INTEGER,
    field: 'max_capacity',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'in_progress', 'completed', 'archived'),
    defaultValue: 'draft'
  },
  qrCodeData: {
    type: DataTypes.STRING(255),
    field: 'qr_code_data',
    allowNull: true
  },
  notifyBeneficiaries: {
    type: DataTypes.BOOLEAN,
    field: 'notify_beneficiaries',
    defaultValue: false
  },
  notifyMentors: {
    type: DataTypes.BOOLEAN,
    field: 'notify_mentors',
    defaultValue: false
  },
  notifyAll: {
    type: DataTypes.BOOLEAN,
    field: 'notify_all',
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE,
    field: 'published_at',
    allowNull: true
  }
}, {
  tableName: 'events',
  timestamps: true,
  underscored: true
});

export default Event;
