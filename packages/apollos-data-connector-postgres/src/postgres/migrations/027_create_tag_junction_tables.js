import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('content_tag', {
    tagId: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    contentItemId: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
  await queryInterface.createTable('people_tag', {
    tagId: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    personId: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('content_tag');
  await queryInterface.dropTable('people_tag');
}

const name = '002-create-tag-junction_tables';

module.exports = { up, down, name };
