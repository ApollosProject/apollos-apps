import { DataTypes } from 'sequelize';
import { configureModel, defineModel } from '../postgres';

const createModel = defineModel({
  modelName: 'user_flags',
  resolveType: () => 'UserFlag',
  attributes: {
    externalPersonId: DataTypes.TEXT,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.user_flags.belongsTo(sequelize.models.comments);
});

export { createModel, setupModel };
