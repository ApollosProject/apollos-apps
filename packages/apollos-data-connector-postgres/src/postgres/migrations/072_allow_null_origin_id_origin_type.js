import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.changeColumn('people', 'origin_id', {
    type: Sequelize.STRING,
    allowNull: true,
  });
  await queryInterface.changeColumn('people', 'origin_type', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.changeColumn('people', 'origin_id', {
    type: Sequelize.STRING,
    allowNull: false,
  });
  await queryInterface.changeColumn('people', 'origin_type', {
    type: Sequelize.STRING,
    allowNull: false,
  });
}

const name = '006-allow-null-origin-id-origin-type';

module.exports = { up, down, name };
