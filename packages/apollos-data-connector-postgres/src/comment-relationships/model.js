import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'comment_relationships',
  resolveType: () => 'CommentRelationship',
  attributes: {
    externalId: DataTypes.TEXT,
    externalSource: DataTypes.TEXT,
    // relatedId: DataTypes.INTEGER,
    relationshipType: DataTypes.TEXT,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.comments.hasMany(sequelize.models.comment_relationships, {
    scope: { relationType: 'person' },
    as: 'people',
  });

  sequelize.models.comments.hasMany(sequelize.models.comment_relationships, {
    scope: { relationType: 'content_item' },
    as: 'contentItem',
  });

  sequelize.models.comment_relationships.belongsTo(sequelize.models.comments);
});

export { setupModel, createModel };
