'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('programs', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    type: {
      type: Sequelize.ENUM('workshop', 'training', 'social', 'mentorship', 'sports'),
      allowNull: false
    },
    color: {
      type: Sequelize.STRING(7),
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('active', 'archived'),
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

  await queryInterface.addIndex('programs', ['type']);
  await queryInterface.addIndex('programs', ['status']);
  await queryInterface.addIndex('programs', ['created_by']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('programs');
}
