import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const IDENTITY_TYPES = {
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
};

const createModel = defineModel({
  modelName: 'otp',
  resolveType: () => 'OTP',
  external: false,
  attributes: {
    code: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(Object.values(IDENTITY_TYPES)),
      allowNull: false,
    },
    identity: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      unique: false,
      allowNull: false,
    },
  },
  sequelizeOptions: {
    tableName: 'otp',
    underscored: true,
  },
});

const setupModel = configureModel(() => {});

export { createModel, setupModel };
