import { Sequelize, DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('contentItems', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    title: {
      type: DataTypes.TEXT,
    },
    summary: {
      type: DataTypes.TEXT,
    },
    htmlContent: {
      type: DataTypes.TEXT,
    },
    publishAt: {
      type: DataTypes.DATE,
    },
    active: {
      type: Sequelize.BOOLEAN,
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
  await queryInterface.addIndex('contentItems', ['originId', 'originType'], {
    unique: true,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('contentItems');
}

const name = '001-create-content-items';

module.exports = { up, down, name };
