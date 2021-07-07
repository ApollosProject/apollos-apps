import { Sequelize, DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('tags', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    name: {
      type: DataTypes.TEXT,
    },
    type: {
      type: DataTypes.TEXT,
    },
    data: {
      type: DataTypes.JSONB,
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
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('tags');
}

const name = '001-create-tags';

module.exports = { up, down, name, order: 3 };
