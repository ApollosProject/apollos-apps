import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('content_item', 'priority', {
    type: Sequelize.INTEGER,
    default: 0,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('content_item', 'priority');
}

module.exports = { up, down };
