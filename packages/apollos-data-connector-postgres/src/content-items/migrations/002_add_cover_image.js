import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('contentItems', 'coverImageId', {
    type: Sequelize.UUID,
    references: {
      model: {
        tableName: 'media',
      },
      key: 'id',
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('contentItems', 'coverImageId');
}

const name = '002-add-cover-image';

module.exports = { up, down, name, order: 7 };
