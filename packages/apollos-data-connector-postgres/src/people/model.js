/* eslint-disable import/prefer-default-export */
import { DataTypes } from 'sequelize';
import { defineModel } from '../postgres';

const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  UNKNOWN: 'UNKNOWN',
};

const createModel = defineModel({
  modelName: 'people',
  resolveType: () => 'Person',
  external: true,
  attributes: {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    profileImageUrl: DataTypes.TEXT,
    gender: DataTypes.ENUM(Object.values(Gender)),
    apollosUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    originId: { type: DataTypes.STRING, allowNull: true },
    originType: { type: DataTypes.STRING, allowNull: true },
  },
  sequelizeOptions: {
    tableName: 'people',
    underscored: true,
    hooks: {
      beforeValidate: (person) => {
        if (person.gender) {
          // eslint-disable-next-line no-param-reassign
          person.gender = person.gender.toUpperCase();
        }
      },
    },
  },
});

export { createModel };
