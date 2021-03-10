import { DataTypes } from 'sequelize';
import { configureModel, defineModel } from '../postgres';

const FollowState = {
  REQUESTED: 'REQUESTED',
  DECLINED: 'DECLINED',
  ACCEPTED: 'ACCEPTED',
};

const createModel = defineModel({
  modelName: 'follows',
  resolveType: () => 'Follow',
  attributes: {
    requestPersonId: DataTypes.UUID,
    followedPersonId: DataTypes.UUID,
    state: DataTypes.ENUM(Object.values(FollowState)),
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.follows.belongsTo(sequelize.models.people, {
    foreignKey: 'requestPersonId',
    as: 'requestPerson',
  });
  sequelize.models.follows.belongsTo(sequelize.models.people, {
    foreignKey: 'followedPersonId',
    as: 'followedPerson',
  });
  sequelize.models.people.hasMany(sequelize.models.follows, {
    foreignKey: 'followedPersonId',
    as: 'followRequests',
  });
  sequelize.models.people.belongsToMany(sequelize.models.people, {
    through: sequelize.models.follows,
    foreignKey: 'followedPersonId',
    otherKey: 'requestPersonId',
    as: 'followers',
  });
});

export { createModel, setupModel, FollowState };
