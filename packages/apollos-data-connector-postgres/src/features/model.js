import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'feature',
  resolveType: () => 'Feature',
  attributes: {
    parentId: DataTypes.UUID,
    parentType: DataTypes.TEXT,
    data: DataTypes.JSONB,
    type: DataTypes.TEXT,
  },
  sequelizeOptions: {
    tableName: 'feature',
    underscored: true,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.feature.belongsTo(sequelize.models.contentItem, {
    foreignKey: 'parentId',
  });
  sequelize.models.contentItem.hasMany(sequelize.models.feature, {
    foreignKey: 'parentId',
    scope: { parentType: 'ContentItem' },
  });
});

export { createModel, setupModel };
