import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'contentItemConnection',
  resolveType: () => 'ContentItemConnection', // shouldn't get called, ContentItem will be set on the shovel.
  external: true,
  attributes: {
    order: DataTypes.INTEGER,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.contentItem.belongsToMany(sequelize.models.contentItem, {
    through: sequelize.models.contentItemConnection,
    as: 'children',
    foreignKey: 'parentId',
    otherKey: 'childId',
  });

  sequelize.models.contentItem.belongsToMany(sequelize.models.contentItem, {
    through: sequelize.models.contentItemConnection,
    as: 'parents',
    otherKey: 'parentId',
    foreignKey: 'childId',
  });
});

export { createModel, setupModel };
