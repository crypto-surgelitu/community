import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Template = sequelize.define('Template', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('event_reminder', 'absence_followup', 'encouragement', 'other'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  variables: {
    type: DataTypes.JSON,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.UUID,
    field: 'created_by',
    allowNull: false
  }
}, {
  tableName: 'templates',
  timestamps: true,
  underscored: true
});

export default Template;
