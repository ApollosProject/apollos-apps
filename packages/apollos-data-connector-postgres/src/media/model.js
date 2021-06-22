import { DataTypes } from 'sequelize';
import { defineModel } from '../postgres';

const createModel = defineModel({
  modelName: 'media',
  resolveType: () => 'Media',
  attributes: {
    type: DataTypes.ENUM(['IMAGE', 'VIDEO', 'AUDIO']),
    url: DataTypes.STRING,
    nodeId: DataTypes.UUID,
    nodeType: DataTypes.STRING,
  },
});

export { createModel };
