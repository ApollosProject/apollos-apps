import { DataTypes } from 'sequelize';
import { defineModel } from '../postgres';

const createModel = defineModel({
  modelName: 'user_flags',
  resolveType: () => 'UserFlag',
  attributes: {
    nodeId: DataTypes.TEXT,
    nodeType: DataTypes.TEXT,
    externalPersonId: DataTypes.TEXT,
  },
});

// eslint-disable-next-line import/prefer-default-export
export { createModel };
