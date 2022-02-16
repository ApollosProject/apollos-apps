import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('feature', 'priority', {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('feature', 'priority');
}

const name = '004-add-feature-priority-field';

module.exports = { up, down, name };
