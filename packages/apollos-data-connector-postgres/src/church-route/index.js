/* eslint-disable import/prefer-default-export */
import { DataTypes } from 'sequelize';
import {
  configureModel,
  getSequelize,
} from '@apollosproject/data-connector-postgres';

// Migrations are currently in multi-tenant/migrations.
const createModel = (context) => {
  const sequelize = getSequelize({
    churchSlug: context.church?.slug,
  });
  sequelize.define(
    'churchRoute',
    {
      routeName: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      churchId: {
        type: DataTypes.UUID,
      },
    },
    {
      underscored: true,
      tableName: 'church_route',
    }
  );
};

const setupModel = configureModel(({ sequelize }) => {
  sequelize.models.church.hasMany(sequelize.models.churchRoute, {
    foreignKey: 'churchId',
  });
  sequelize.models.churchRoute.belongsTo(sequelize.models.church, {
    foreignKey: 'churchId',
  });
});

export const models = { createModel, setupModel };
