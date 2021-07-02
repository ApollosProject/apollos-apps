import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'contentItemCategory',
  resolveType: () => 'ContentItemCategory',
  external: true,
  attributes: {
    title: DataTypes.TEXT,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.contentItem.belongsTo(sequelize.models.contentItemCategory);
  sequelize.models.contentItemCategory.hasMany(sequelize.models.contentItem);
});

export { createModel, setupModel };
