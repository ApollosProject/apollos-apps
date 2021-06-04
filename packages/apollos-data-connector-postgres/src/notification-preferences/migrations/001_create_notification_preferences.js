import { Sequelize, DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('notificationPreferences', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    enabled: {
      type: Sequelize.BOOLEAN,
    },
    notificationProviderId: {
      type: DataTypes.TEXT,
    },
    notificationProviderType: {
      type: DataTypes.TEXT,
    },
    personId: {
      type: Sequelize.UUID,
      references: {
        model: 'people',
        key: 'id',
      },
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

  await queryInterface.addIndex(
    'notificationPreferences',
    ['personId', 'notificationProviderType', 'notificationProviderId'],
    {
      unique: true,
    }
  );
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('notificationPreferences');
}

const name = '001-create-notification-preferences';

module.exports = { up, down, name, order: 3 };
