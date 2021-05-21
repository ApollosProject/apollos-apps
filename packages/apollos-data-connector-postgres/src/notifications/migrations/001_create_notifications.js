import { Sequelize, DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('notifications', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    title: {
      type: DataTypes.TEXT,
    },
    subtitle: {
      type: DataTypes.TEXT,
    },
    body: {
      type: DataTypes.TEXT,
    },
    sentAt: {
      type: DataTypes.DATE,
    },
    scheduledAt: {
      type: DataTypes.DATE,
    },
    data: {
      type: DataTypes.JSON,
    },
    notificationType: {
      type: DataTypes.TEXT,
    },
    deliveryMethod: {
      type: DataTypes.TEXT,
    },
    personId: {
      type: Sequelize.UUID,
      references: {
        model: 'people',
        key: 'id',
      },
    },
    externalNotificationId: {
      type: DataTypes.TEXT,
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
  await queryInterface.dropTable('notifications');
}

const name = '001-create-notifications';

module.exports = { up, down, name, order: 3 };
