import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'media',
  resolveType: () => 'Media',
  external: true,
  attributes: {
    type: DataTypes.ENUM(['IMAGE', 'VIDEO', 'AUDIO']),
    url: DataTypes.STRING,
    nodeId: DataTypes.UUID,
    nodeType: DataTypes.STRING,
  },
  sequelizeOptions: {
    tableName: 'media',
    underscored: true,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.contentItem.hasMany(sequelize.models.media, {
    foreignKey: 'nodeId',
    sourceKey: 'id',
    constraints: false,
    scope: { nodeType: 'ContentItem', type: 'IMAGE' },
    as: 'images',
  });
  sequelize.models.contentItem.hasMany(sequelize.models.media, {
    foreignKey: 'nodeId',
    sourceKey: 'id',
    constraints: false,
    scope: { nodeType: 'ContentItem', type: 'VIDEO' },
    as: 'videos',
  });
  sequelize.models.contentItem.hasMany(sequelize.models.media, {
    foreignKey: 'nodeId',
    sourceKey: 'id',
    constraints: false,
    scope: { nodeType: 'ContentItem', type: 'AUDIO' },
    as: 'audio',
  });
});

export { createModel, setupModel };
