import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      is: /^\+?[0-9]{10,15}$/
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: { isEmail: true }
  },
  zoneId: {
    type: DataTypes.UUID,
    field: 'zone_id',
    allowNull: true
  },
  dateJoined: {
    type: DataTypes.DATE,
    field: 'date_joined',
    defaultValue: DataTypes.NOW
  },
  engagementLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    field: 'engagement_level',
    defaultValue: 'low'
  },
  lastAttendanceDate: {
    type: DataTypes.DATE,
    field: 'last_attendance_date',
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'at_risk', 'inactive'),
    defaultValue: 'active'
  },
  createdBy: {
    type: DataTypes.UUID,
    field: 'created_by',
    allowNull: false
  }
}, {
  tableName: 'members',
  timestamps: true,
  underscored: true
});

export default Member;
