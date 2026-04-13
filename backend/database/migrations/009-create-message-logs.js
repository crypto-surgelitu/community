'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('message_logs', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    recipient_member_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'members',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    sender_user_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    message_content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    message_type: {
      type: Sequelize.ENUM('whatsapp', 'sms', 'email'),
      defaultValue: 'whatsapp'
    },
    status: {
      type: Sequelize.ENUM('pending', 'sent', 'failed'),
      defaultValue: 'pending'
    },
    sent_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });

  await queryInterface.addIndex('message_logs', ['recipient_member_id']);
  await queryInterface.addIndex('message_logs', ['status']);
  await queryInterface.addIndex('message_logs', ['sent_at']);
  await queryInterface.addIndex('message_logs', ['sender_user_id']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('message_logs');
}
