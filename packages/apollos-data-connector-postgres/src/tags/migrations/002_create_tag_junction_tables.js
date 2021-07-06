import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('content_tag', {
    tagId: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    contentId: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
  });
  await queryInterface.createTable('people_tag', {
    tagId: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    peopleId: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('content_tag');
  await queryInterface.dropTable('people_tag');
}

const name = '002-create-tag-junction_tables';

module.exports = { up, down, name, order: 4 };
