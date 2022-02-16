import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('people', 'phone', {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('people', 'phone');
}

const name = '005-add-phone-to-person';

module.exports = { up, down, name };
