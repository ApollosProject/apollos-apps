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
    personId: {
      type: DataTypes.UUID,
      unique: false,
      allowNull: true,
    },
  },
  sequelizeOptions: {
    tableName: 'otp',
    underscored: true,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.people.hasMany(sequelize.models.otp);
  sequelize.models.otp.belongsTo(sequelize.models.people);
});

export { createModel, setupModel };
