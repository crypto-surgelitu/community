import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Program = sequelize.define('Program', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('workshop', 'training', 'social', 'mentorship', 'sports'),
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'archived'),
    defaultValue: 'active'
  },
  createdBy: {
    type: DataTypes.UUID,
    field: 'created_by',
    allowNull: false
  }
}, {
  tableName: 'programs',
  timestamps: true,
  underscored: true
});

export default Program;
