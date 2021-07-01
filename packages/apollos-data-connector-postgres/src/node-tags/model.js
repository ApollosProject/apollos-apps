import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'nodeTag',
  resolveType: () => 'NodeTag', // shouldn't get called, ContentItem will be set on the shovel.
  external: true,
  attributes: {},
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.contentItem.hasMany(sequelize.models.nodeTag, {
    foreignKey: 'nodeId',
    sourceKey: 'id',
    constraints: false,
  });
});

export { createModel, setupModel };
