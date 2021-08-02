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
  sequelizeOptions: {
    tableName: 'tag',
    underscored: true,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.contentItem.belongsToMany(sequelize.models.tag, {
    through: 'content_tag',
    as: 'tags',
  });
  sequelize.models.tag.belongsToMany(sequelize.models.contentItem, {
    through: 'content_tag',
    as: 'contentItems',
  });
  sequelize.models.people.belongsToMany(sequelize.models.tag, {
    through: 'people_tag',
    as: 'tags',
  });
  sequelize.models.tag.belongsToMany(sequelize.models.people, {
    through: 'people_tag',
    as: 'people',
  });
});

export { createModel, setupModel };
