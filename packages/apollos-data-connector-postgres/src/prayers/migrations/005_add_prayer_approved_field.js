import { DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('prayer_request', 'approved', {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  });
  await queryInterface.addColumn('prayer_request', 'flag_count', {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('prayer_request', 'approved');
  await queryInterface.removeColumn('prayer_request', 'flag_count');
}

const name = '005-add-prayer-approved-field';

module.exports = { up, down, name, order: 7 };
