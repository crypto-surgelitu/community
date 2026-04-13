import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Feedback = sequelize.define('Feedback', {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  sentiment: {
    type: DataTypes.ENUM('loved_it', 'good', 'ok', 'didnt_enjoy', 'hated_it'),
    allowNull: false
  },
  textFeedback: {
    type: DataTypes.TEXT,
    field: 'text_feedback',
    allowNull: true
  },
  submittedAt: {
    type: DataTypes.DATE,
    field: 'submitted_at',
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'feedback',
  timestamps: true,
  underscored: true
});

export default Feedback;
