import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('person_prayed_for', {
    person_id: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    prayer_request_id: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('person_prayed_for');
}

const name = '003-create-person-prayed-for-table';

module.exports = { up, down, name };
