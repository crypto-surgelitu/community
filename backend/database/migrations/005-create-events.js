'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('events', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    program_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'programs',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    organizer_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
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
    event_date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    event_time: {
      type: Sequelize.TIME,
      allowNull: false
    },
    duration_minutes: {
      type: Sequelize.INTEGER,
      defaultValue: 120
    },
    location: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    max_capacity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('draft', 'published', 'in_progress', 'completed', 'archived'),
      defaultValue: 'draft'
    },
    qr_code_data: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    notify_beneficiaries: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    notify_mentors: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    notify_all: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    published_at: {
      type: Sequelize.DATE,
      allowNull: true
    }
  });

  await queryInterface.addIndex('events', ['event_date']);
  await queryInterface.addIndex('events', ['status']);
  await queryInterface.addIndex('events', ['organizer_id']);
  await queryInterface.addIndex('events', ['program_id']);
  await queryInterface.addIndex('events', ['zone_id']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('events');
}
