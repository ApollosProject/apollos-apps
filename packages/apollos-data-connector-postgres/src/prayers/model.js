import { DataTypes } from 'sequelize';
import { configureModel, defineModel } from '../postgres';

const createModel = defineModel({
  modelName: 'prayerRequest',
  resolveType: () => 'PrayerRequest',
  attributes: {
    text: DataTypes.TEXT,
    originId: DataTypes.TEXT,
    originType: DataTypes.TEXT,
  },
  sequelizeOptions: {
    tableName: 'prayer_request',
    underscored: true,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.prayerRequest.addScope('defaultScope', {
    include: [{ model: sequelize.models.people, as: 'prayedUsers' }],
  });
  sequelize.models.people.hasMany(sequelize.models.prayerRequest, {
    foreignKey: 'personId',
  });
  sequelize.models.prayerRequest.belongsTo(sequelize.models.people, {
    foreignKey: 'personId',
    as: 'requestor',
  });

  sequelize.models.prayerRequest.belongsToMany(sequelize.models.people, {
    through: 'person_prayed_for',
    as: 'prayedUsers',
  });
});

export { createModel, setupModel };
