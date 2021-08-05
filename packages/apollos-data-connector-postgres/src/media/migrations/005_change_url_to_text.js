import { DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.changeColumn('media', 'url', {
    type: DataTypes.TEXT,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.changeColumn('media', 'url', {
    type: DataTypes.STRING,
  });
}

const name = '005-change_url_to_text';

module.exports = { up, down, name, order: 8 };
