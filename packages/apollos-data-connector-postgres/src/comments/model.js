import { DataTypes } from 'sequelize';
import { defineModel } from '../postgres';

const createModel = defineModel({
  modelName: 'comments',
  resolveType: () => 'Comment',
  attributes: {
    text: DataTypes.TEXT,
    externalParentId: DataTypes.TEXT,
    externalParentType: DataTypes.TEXT,
    externalParentSource: DataTypes.TEXT,
    externalPersonId: DataTypes.TEXT,
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

// eslint-disable-next-line import/prefer-default-export
export { createModel };
