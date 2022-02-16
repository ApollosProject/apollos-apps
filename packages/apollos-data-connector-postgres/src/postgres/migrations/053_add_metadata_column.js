import { DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('media', 'metadata', {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('media', 'metadata');
}

const name = '004-add_metadata_column';

module.exports = { up, down, name };
