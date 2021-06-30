import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('contentItems', 'parentId', {
    type: Sequelize.UUID,
    references: {
      model: {
        tableName: 'contentItems',
      },
      key: 'id',
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('contentItems', 'parentId');
}

const name = '003-add-parent';

module.exports = { up, down, name, order: 7 };
