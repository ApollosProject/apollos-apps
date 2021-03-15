import { Sequelize } from 'sequelize';

const Visibility = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  FOLLOWERS: 'FOLLOWERS',
};

async function up({ context: queryInterface }) {
  await queryInterface.createTable('comments', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    text: Sequelize.TEXT,
    visibility: Sequelize.ENUM(Object.values(Visibility)),
    externalParentId: Sequelize.TEXT,
    externalParentType: Sequelize.TEXT,
    externalParentSource: Sequelize.TEXT,
    personId: {
      type: Sequelize.UUID,
      references: {
        model: 'people',
        key: 'id',
      },
    },
    flagCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
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
  await queryInterface.dropTable('comments');
}

const name = '001-create-comments';

module.exports = { up, down, name, order: 3 };
