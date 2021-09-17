import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'campus',
  resolveType: () => 'Campus',
  external: true,
  attributes: {
    name: DataTypes.TEXT,
    street1: DataTypes.TEXT,
    street2: DataTypes.TEXT,
    city: DataTypes.TEXT,
    state: DataTypes.TEXT,
    postalCode: DataTypes.TEXT,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    imageUrl: DataTypes.TEXT,
    digital: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN,
    distanceFromLocation: DataTypes.VIRTUAL,
  },
  sequelizeOptions: {
    tableName: 'campus',
    underscored: true,
  },
});

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.campus.hasMany(sequelize.models.people);
  sequelize.models.people.belongsTo(sequelize.models.campus);

  sequelize.models.campus.addScope('defaultScope', {
    where: { active: true },
  });

  // Campus relationship to media is optional and contingent on media being loaded.
  if (sequelize.models.media)
    sequelize.models.campus.belongsTo(sequelize.models.media, {
      as: 'image',
      foreignKey: 'imageId',
    });
});

export { createModel, setupModel };
