import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'church',
  resolveType: () => 'Church',
  external: false,
  attributes: {
    slug: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
  },
  sequelizeOptions: {
    underscored: true,
    tableName: 'church',
  },
});

const setupModel = configureModel(() => {});

export default { createModel, setupModel };
