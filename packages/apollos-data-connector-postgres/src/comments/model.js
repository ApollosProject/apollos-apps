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
    // reportCount: {
    //   type: DataTypes.INTEGER,
    //   default: 0
    // }
  },
  sequelizeOptions: {
    indexes: [
      {
        unique: true,
        fields: [
          'externalParentId',
          'externalParentType',
          'externalPersonId',
          'text',
        ],
      },
    ],
  },
});

export { createModel, Visibility };
