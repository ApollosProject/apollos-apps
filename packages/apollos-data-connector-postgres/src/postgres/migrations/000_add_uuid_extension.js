async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
  );
}

async function down() {
  // no
}

const name = '000-add-uuid-extension';

module.exports = { up, down, name, order: 0 };
