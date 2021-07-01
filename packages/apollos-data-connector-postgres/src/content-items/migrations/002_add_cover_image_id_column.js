import { Sequelize, DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('contentItems', 'coverImageId', {
    type: Sequelize.STRING,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('contentItems');
}

const name = '0002_add_cover_image_id_column';

module.exports = { up, down, name, order: 3 };
