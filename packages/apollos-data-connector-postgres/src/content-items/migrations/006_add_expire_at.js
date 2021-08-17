import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('content_item', 'expire_at', {
    type: Sequelize.DATE,
  });

  // Some additional indexes to improve querying speed
  await queryInterface.addIndex('content_item', ['publish_at']);
  await queryInterface.addIndex('content_item', ['expire_at']);
  await queryInterface.addIndex('content_item', ['active']);
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('content_item', 'expire_at');
}

const name = '006-add-expire-at';

module.exports = { up, down, name, order: 8 };
