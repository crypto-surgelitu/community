'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('attendance', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    event_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    member_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'members',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    checked_in_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    checked_in_by: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    check_in_method: {
      type: Sequelize.ENUM('qr_scan', 'manual', 'ussd'),
      defaultValue: 'qr_scan'
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });

  await queryInterface.addConstraint('attendance', {
    fields: ['event_id', 'member_id'],
    type: 'unique',
    name: 'unique_attendance'
  });

  await queryInterface.addIndex('attendance', ['event_id']);
  await queryInterface.addIndex('attendance', ['member_id']);
  await queryInterface.addIndex('attendance', ['checked_in_at']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('attendance');
}
