import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'refreshToken',
  resolveType: () => 'RefreshToken',
  external: false,
  attributes: {
    jwtToken: {
      type: DataTypes.TEXT,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    personId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'people',
        key: 'id',
      },
    },
    apollosId: {
      type: DataTypes.STRING,
      allowNull: true, // we set this value with an "afterCreate" hook if not set.
      unique: true,
    },
    apollosType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  sequelizeOptions: {
    underscored: true,
    tableName: 'refresh_token',
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.people.hasMany(sequelize.models.refreshToken);
  sequelize.models.refreshToken.belongsTo(sequelize.models.people);
});

export { createModel, setupModel };
