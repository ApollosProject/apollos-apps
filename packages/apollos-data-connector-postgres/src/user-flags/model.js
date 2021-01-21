import { DataTypes } from 'sequelize';
import { configureModel, defineModel } from '../postgres';

const createModel = defineModel({
  modelName: 'user_flags',
  resolveType: () => 'UserFlag',
  attributes: {
    commentId: DataTypes.INTEGER,
    externalPersonId: DataTypes.TEXT,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.user_flags.belongsTo(sequelize.models.comments);
});

export { createModel, setupModel };
