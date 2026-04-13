'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('templates', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    category: {
      type: Sequelize.ENUM('event_reminder', 'absence_followup', 'encouragement', 'other'),
      allowNull: false
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    variables: {
      type: Sequelize.JSON,
      allowNull: true
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

  await queryInterface.addIndex('templates', ['category']);
  await queryInterface.addIndex('templates', ['created_by']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('templates');
}
