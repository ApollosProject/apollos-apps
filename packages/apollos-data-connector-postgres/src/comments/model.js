import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const Visibility = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  FOLLOWERS: 'FOLLOWERS',
};

const createModel = defineModel({
  modelName: 'comments',
  resolveType: () => 'Comment',
  attributes: {
    text: DataTypes.TEXT,
    visibility: DataTypes.ENUM(Object.values(Visibility)),
    externalParentId: DataTypes.TEXT,
    externalParentType: DataTypes.TEXT,
    externalParentSource: DataTypes.TEXT,
    flagCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    likedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  sequelizeOptions: {
    tableName: 'comment',
    underscored: true,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.comments.belongsTo(sequelize.models.people);
  sequelize.models.people.hasMany(sequelize.models.comments);

  // Used to identify user relationships when querying for comments
  // Specifically, to sort the comments of those you follow to the top
  sequelize.models.comments.hasMany(sequelize.models.follows, {
    foreignKey: 'followedPersonId',
    sourceKey: 'personId',
    constraints: false,
  });

  sequelize.models.comments.hasMany(sequelize.models.user_likes, {
    foreignKey: 'nodeId',
    sourceKey: 'id',
    constraints: false,
    scope: { nodeType: 'Comment' },
  });
});

export { createModel, Visibility, setupModel };
