import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('user_likes', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    nodeId: Sequelize.TEXT,
    nodeType: Sequelize.TEXT,
    personId: Sequelize.UUID,
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
  await queryInterface.dropTable('user_likes');
}

const name = '001-create-user-likes';

module.exports = { up, down, name, order: 3 };
