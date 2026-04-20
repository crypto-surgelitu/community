'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'zone_id', {
    type: Sequelize.UUID,
    allowNull: true,
    references: {
      model: 'zones',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });

  await queryInterface.addIndex('users', ['zone_id']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'zone_id');
}
