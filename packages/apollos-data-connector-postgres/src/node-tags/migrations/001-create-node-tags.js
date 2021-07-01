import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('nodeTag', {
    tagId: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    nodeId: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('tag');
}

const name = '001-create-node-tags';

module.exports = { up, down, name, order: 4 };
