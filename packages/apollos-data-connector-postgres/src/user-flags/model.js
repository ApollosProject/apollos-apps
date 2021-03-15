import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'user_flags',
  resolveType: () => 'UserFlag',
  attributes: {
    nodeId: DataTypes.TEXT,
    nodeType: DataTypes.TEXT,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.user_flags.belongsTo(sequelize.models.people);
  sequelize.models.people.hasMany(sequelize.models.user_flags);
});
// eslint-disable-next-line import/prefer-default-export
export { createModel, setupModel };
