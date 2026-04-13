import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.UUID,
    field: 'event_id',
    allowNull: false
  },
  memberId: {
    type: DataTypes.UUID,
    field: 'member_id',
    allowNull: false
  },
  checkedInAt: {
    type: DataTypes.DATE,
    field: 'checked_in_at',
    allowNull: true
  },
  checkedInBy: {
    type: DataTypes.UUID,
    field: 'checked_in_by',
    allowNull: true
  },
  checkInMethod: {
    type: DataTypes.ENUM('qr_scan', 'manual', 'ussd'),
    field: 'check_in_method',
    defaultValue: 'qr_scan'
  }
}, {
  tableName: 'attendance',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['event_id', 'member_id']
    }
  ]
});

export default Attendance;
