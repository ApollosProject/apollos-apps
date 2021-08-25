import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'interaction',
  resolveType: () => 'Interaction',
  external: true,
  attributes: {
    action: {
      type: DataTypes.STRING,
    },
    arguments: {
      type: DataTypes.JSONB,
    },
    nodeId: { type: DataTypes.UUID },
    nodeType: { type: DataTypes.TEXT },
    // Overrides default behavior. Null is okay in this case.
    originId: { type: DataTypes.STRING, allowNull: true },
    originType: { type: DataTypes.STRING, allowNull: true },
  },
  sequelizeOptions: {
    tableName: 'interaction',
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.interaction.belongsTo(sequelize.models.people, {
    foreignKey: 'personId',
  });
  sequelize.models.interaction.belongsTo(sequelize.models.contentItem, {
    foreignKey: 'nodeId',
    constraints: false,
  });
});

export { createModel, setupModel };
