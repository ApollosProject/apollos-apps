import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('contentItemCategories', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    title: {
      type: Sequelize.TEXT,
    },
    originId: { type: Sequelize.STRING, allowNull: false },
    originType: { type: Sequelize.STRING, allowNull: false },
    apollosId: {
      type: Sequelize.STRING,
      allowNull: true, // we set this value with an "afterCreate" hook if not set.
      unique: true,
    },
    apollosType: {
      type: Sequelize.STRING,
      allowNull: false,
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
  await queryInterface.addIndex(
    'contentItemCategories',
    ['originId', 'originType'],
    {
      unique: true,
    }
  );

  await queryInterface.addColumn('contentItems', 'contentItemCategoryId', {
    type: Sequelize.UUID,
  });

  await queryInterface.addConstraint('contentItems', {
    fields: ['contentItemCategoryId'],
    type: 'foreign key',
    references: {
      table: 'contentItemCategories',
      field: 'id',
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('contentItemCategories');

  await queryInterface.removeColumn('contentItems', 'contentItemCategoryId');
}

const name = '001-create-content-items-categories';

module.exports = { up, down, name, order: 5 };
