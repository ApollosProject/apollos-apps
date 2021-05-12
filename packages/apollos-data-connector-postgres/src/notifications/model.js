import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'notifications',
  resolveType: () => 'Notification',
  attributes: {
    title: DataTypes.TEXT,
    subtitle: DataTypes.TEXT,
    body: DataTypes.TEXT,
    sentAt: DataTypes.DATE,
    scheduledAt: DataTypes.DATE,
    data: DataTypes.JSON,
    notificationType: DataTypes.TEXT,
    deliveryMethod: DataTypes.TEXT,
    externalNotificationId: DataTypes.TEXT,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.notifications.belongsTo(sequelize.models.people);
  sequelize.models.people.hasMany(sequelize.models.notifications);
});

export { createModel, setupModel };
