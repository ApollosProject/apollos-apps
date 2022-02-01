/* eslint-disable import/prefer-default-export */
import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'openIdIdentity',
  resolveType: () => 'OpenIdIdentity',
  external: false,
  attributes: {
    providerType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
    },
    idToken: {
      type: DataTypes.TEXT,
    },
    providerSessionId: {
      type: DataTypes.TEXT,
    },
  },
  sequelizeOptions: {
    underscored: true,
    tableName: 'open_id_identity',
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.openIdIdentity.belongsTo(sequelize.models.people);
  sequelize.models.people.hasMany(sequelize.models.openIdIdentity);
});

export { createModel, setupModel };
