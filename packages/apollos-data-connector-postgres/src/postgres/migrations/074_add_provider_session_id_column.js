import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  /*
  Add a column for storing an external auth provider session ID.
  This is important for Okta, but potentially others.
  */
  await queryInterface.addColumn('open_id_identity', 'provider_session_id', {
    type: Sequelize.TEXT,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('open_id_identity', 'provider_session_id');
}

const name = '002_add_provider_session_id_column';

module.exports = { up, down, name };
