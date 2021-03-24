import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('comments', 'likedCount', {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('comments', 'likedCount');
}

const name = '002-add-liked-count';

module.exports = { up, down, name, order: 3 };
