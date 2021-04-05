import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'user_likes',
  resolveType: () => 'UserLike',
  attributes: {
    nodeId: DataTypes.UUID,
    nodeType: DataTypes.TEXT,
    personId: DataTypes.UUID,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.user_likes.belongsTo(sequelize.models.people);
  sequelize.models.people.hasMany(sequelize.models.user_likes);
});

export { createModel, setupModel };
