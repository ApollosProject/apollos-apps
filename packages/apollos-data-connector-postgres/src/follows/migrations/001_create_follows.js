import { Sequelize } from 'sequelize';

const FollowState = {
  REQUESTED: 'REQUESTED',
  DECLINED: 'DECLINED',
  ACCEPTED: 'ACCEPTED',
};

async function up({ context: queryInterface }) {
  await queryInterface.createTable('follows', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    requestPersonId: {
      type: Sequelize.UUID,
      references: {
        model: 'people',
        key: 'id',
      },
    },
    followedPersonId: {
      type: Sequelize.UUID,
      references: {
        model: 'people',
        key: 'id',
      },
    },
    state: Sequelize.ENUM(Object.values(FollowState)),
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
  await queryInterface.dropTable('follows');
}

const name = '001-create-follows';

module.exports = { up, down, name, order: 3 };
