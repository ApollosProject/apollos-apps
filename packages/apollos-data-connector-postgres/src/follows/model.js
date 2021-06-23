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
    as: 'follower',
  });
  sequelize.models.follows.belongsTo(sequelize.models.people, {
    foreignKey: 'followedPersonId',
    as: 'following',
  });
  sequelize.models.people.hasMany(sequelize.models.follows, {
    foreignKey: 'requestPersonId',
    as: 'requestedFollows',
  });
  sequelize.models.people.hasMany(sequelize.models.follows, {
    foreignKey: 'followedPersonId',
    as: 'followingRequests',
  });

  sequelize.models.people.belongsToMany(sequelize.models.people, {
    through: sequelize.models.follows,
    foreignKey: 'followedPersonId',
    otherKey: 'requestPersonId',
    as: 'followers',
  });

  sequelize.models.people.belongsToMany(sequelize.models.people, {
    through: sequelize.models.follows,
    foreignKey: 'requestPersonId',
    otherKey: 'followedPersonId',
    as: 'following',
  });
});

export { createModel, setupModel, FollowState };
