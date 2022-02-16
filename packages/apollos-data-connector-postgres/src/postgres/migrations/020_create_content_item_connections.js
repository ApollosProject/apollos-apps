import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('contentItemsConnections', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    order: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    childId: {
      type: Sequelize.UUID,
      references: {
        model: 'contentItems',
        key: 'id',
      },
    },
    parentId: {
      type: Sequelize.UUID,
      references: {
        model: 'contentItems',
        key: 'id',
      },
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
    'contentItemsConnections',
    ['originId', 'originType'],
    {
      unique: true,
    }
  );
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('contentItemsConnections');
}

const name = '001-create-content-items-connections';

module.exports = { up, down, name };
