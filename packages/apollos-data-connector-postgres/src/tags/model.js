import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'tag',
  resolveType: () => 'Tag', // shouldn't get called, ContentItem will be set on the shovel.
  external: true,
  attributes: {
    name: DataTypes.TEXT,
    type: DataTypes.TEXT,
    data: DataTypes.JSONB,
  },
});

const setupModel = configureModel(() => {});

export { createModel, setupModel };
