import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Zone = sequelize.define('Zone', {
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
  color: {
    type: DataTypes.STRING(7),
    allowNull: true
  }
}, {
  tableName: 'zones',
  timestamps: true,
  underscored: true
});

export default Zone;
