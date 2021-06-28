import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

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

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.contentItem.hasMany(sequelize.models.media, {
    foreignKey: 'nodeId',
    sourceKey: 'id',
    constraints: false,
    scope: { nodeType: 'ContentItem', type: 'IMAGE' },
  });
  sequelize.models.contentItem.hasMany(sequelize.models.media, {
    foreignKey: 'nodeId',
    sourceKey: 'id',
    constraints: false,
    scope: { nodeType: 'ContentItem', type: 'VIDEO' },
  });
  sequelize.models.contentItem.hasMany(sequelize.models.media, {
    foreignKey: 'nodeId',
    sourceKey: 'id',
    constraints: false,
    scope: { nodeType: 'ContentItem', type: 'AUDIO' },
  });
  sequelize.models.media.hasOne(sequelize.models.contentItem);
});

export { createModel, setupModel };
