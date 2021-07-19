import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('user_flags', 'personId', {
    type: Sequelize.UUID,
    references: {
      model: {
        tableName: 'people',
      },
      key: 'id',
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropColumn('peope');
}

const name = '002-add-person-id';

module.exports = { up, down, name, order: 4 };
