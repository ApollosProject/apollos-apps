import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'contentItemsConnection',
  resolveType: () => 'ContentItemConnection', // shouldn't get called, ContentItem will be set on the shovel.
  external: true,
  attributes: {
    order: DataTypes.INTEGER,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.contentItem.belongsToMany(sequelize.models.contentItem, {
    through: sequelize.models.contentItemsConnection,
    as: 'children',
    foreignKey: 'parentId',
    otherKey: 'childId',
  });

  sequelize.models.contentItem.belongsToMany(sequelize.models.contentItem, {
    through: sequelize.models.contentItemsConnection,
    as: 'parents',
    otherKey: 'parentId',
    foreignKey: 'childId',
  });
});

export { createModel, setupModel };
