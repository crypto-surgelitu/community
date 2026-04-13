'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('members', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    zone_id: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'zones',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    date_joined: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    engagement_level: {
      type: Sequelize.ENUM('low', 'medium', 'high'),
      defaultValue: 'low'
    },
    last_attendance_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('active', 'at_risk', 'inactive'),
      defaultValue: 'active'
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    created_by: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    }
  });

  await queryInterface.addIndex('members', ['phone']);
  await queryInterface.addIndex('members', ['zone_id']);
  await queryInterface.addIndex('members', ['status']);
  await queryInterface.addIndex('members', ['engagement_level']);
  await queryInterface.addIndex('members', ['created_by']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('members');
}
