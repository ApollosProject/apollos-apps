import { DataTypes, Op, Sequelize } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'contentItem',
  resolveType: () => 'UniversalContentItem', // shouldn't get called, ContentItem will be set on the shovel.
  external: true,
  attributes: {
    title: DataTypes.TEXT,
    summary: DataTypes.TEXT,
    htmlContent: DataTypes.TEXT,
    publishAt: DataTypes.DATE,
    expireAt: DataTypes.DATE,
    active: DataTypes.BOOLEAN,
    priority: DataTypes.INTEGER,
  },
  sequelizeOptions: {
    tableName: 'content_item',
    underscored: true,
  },
});

const activeFilter = {
  [Op.and]: [
    { active: true },
    {
      publishAt: {
        [Op.or]: [{ [Op.lte]: Sequelize.literal('NOW()') }, null],
      },
    },
    {
      expireAt: {
        [Op.or]: [{ [Op.gte]: Sequelize.literal('NOW()') }, null],
      },
    },
  ],
};

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.contentItem.addScope('defaultScope', {
    include: [{ model: sequelize.models.media, as: 'coverImage' }],
    where: {
      ...activeFilter,
    },
  });
  sequelize.models.contentItem.belongsTo(sequelize.models.media, {
    as: 'coverImage',
    foreignKey: 'coverImageId',
  });

  sequelize.models.contentItem.belongsTo(sequelize.models.contentItem, {
    as: 'parent',
    foreignKey: 'parentId',
  });

  sequelize.models.contentItem.hasMany(sequelize.models.contentItem, {
    as: 'directChildren',
    foreignKey: 'parentId',
  });
});

export { createModel, setupModel, activeFilter };
