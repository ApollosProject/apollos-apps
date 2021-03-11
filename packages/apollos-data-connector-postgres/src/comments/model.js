import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const Visibility = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  FOLLOWERS: 'FOLLOWERS',
};

const createModel = defineModel({
  modelName: 'comments',
  resolveType: () => 'Comment',
  attributes: {
    text: DataTypes.TEXT,
    visibility: DataTypes.ENUM(Object.values(Visibility)),
    externalParentId: DataTypes.TEXT,
    externalParentType: DataTypes.TEXT,
    externalParentSource: DataTypes.TEXT,
    flagCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.comments.belongsTo(sequelize.models.people);
  sequelize.models.people.hasMany(sequelize.models.comments);
});

export { createModel, Visibility, setupModel };
