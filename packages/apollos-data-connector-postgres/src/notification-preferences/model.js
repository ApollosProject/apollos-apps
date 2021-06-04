import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'notificationPreferences',
  resolveType: () => 'NotificationPreference',
  attributes: {
    enabled: DataTypes.BOOLEAN,
    notificationProviderId: DataTypes.TEXT,
    notificationProviderType: DataTypes.TEXT,
  },
  sequelizeOptions: {
    indexes: [
      {
        unique: true,
        fields: [
          'personId',
          'notificationProviderType',
          'notificationProviderId',
        ],
      },
    ],
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.notificationPreferences.belongsTo(sequelize.models.people);
  sequelize.models.people.hasMany(sequelize.models.notificationPreferences);
});

export { createModel, setupModel };
