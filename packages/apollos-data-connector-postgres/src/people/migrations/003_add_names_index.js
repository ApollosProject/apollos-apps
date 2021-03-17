async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    `CREATE index in_people_firstName_and_lastName ON people USING gin (lower("firstName" || ' ' || "lastName") gin_trgm_ops)`
  );
}

async function down() {
  // no
}

const name = '003-add-name-index';

module.exports = { up, down, name, order: 4 };
