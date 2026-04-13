'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('feedback', {
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
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    sentiment: {
      type: Sequelize.ENUM('loved_it', 'good', 'ok', 'didnt_enjoy', 'hated_it'),
      allowNull: false
    },
    text_feedback: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    submitted_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });

  await queryInterface.addIndex('feedback', ['event_id']);
  await queryInterface.addIndex('feedback', ['submitted_at']);
  await queryInterface.addIndex('feedback', ['rating']);
  await queryInterface.addIndex('feedback', ['sentiment']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('feedback');
}
