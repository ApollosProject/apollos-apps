import { DataTypes } from 'sequelize';
import { defineModel } from '../postgres';

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
    externalParentId: DataTypes.TEXT,
    externalParentType: DataTypes.TEXT,
    externalParentSource: DataTypes.TEXT,
    externalPersonId: DataTypes.TEXT,
    visibility: DataTypes.ENUM(Object.values(Visibility)),
    flagCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
});

export { createModel, Visibility };
