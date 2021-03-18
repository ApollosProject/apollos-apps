import Sequelize from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addIndex('people', {
    name: 'in_people_firstName_and_lastName',
    using: 'gin',
    fields: [
      Sequelize.literal(
        'lower("firstName" || \' \' || "lastName") gin_trgm_ops'
      ),
    ],
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.sequelize.removeIndex(
    'people',
    'in_people_firstName_and_lastName'
  );
}

const name = '003-add-name-index';

module.exports = { up, down, name, order: 4 };
