import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const MessageLog = sequelize.define('MessageLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  recipientMemberId: {
    type: DataTypes.UUID,
    field: 'recipient_member_id',
    allowNull: false
  },
  senderUserId: {
    type: DataTypes.UUID,
    field: 'sender_user_id',
    allowNull: false
  },
  messageContent: {
    type: DataTypes.TEXT,
    field: 'message_content',
    allowNull: false
  },
  messageType: {
    type: DataTypes.ENUM('whatsapp', 'sms', 'email'),
    field: 'message_type',
    defaultValue: 'whatsapp'
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'failed'),
    defaultValue: 'pending'
  },
  sentAt: {
    type: DataTypes.DATE,
    field: 'sent_at',
    allowNull: true
  }
}, {
  tableName: 'message_logs',
  timestamps: true,
  underscored: true
});

export default MessageLog;
