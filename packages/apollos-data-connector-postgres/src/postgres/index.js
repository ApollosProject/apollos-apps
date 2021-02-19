/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

import './pgEnum-fix';
import { Sequelize, DataTypes } from 'sequelize';
import { createGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';

const sequelizeConfigOptions =
  process.env.NODE_ENV === 'test' ? { logging: false } : {};

// Use the DB url from the apollos config if provided.
// Otherwise, expect methods to provide their own connection.
const sequelize = ApollosConfig?.DATABASE?.URL
  ? new Sequelize(ApollosConfig?.DATABASE?.URL, {
      ...sequelizeConfigOptions,
      ...(ApollosConfig?.DATABASE?.OPTIONS || {}),
    })
  : null;

class PostgresDataSource {
  initialize(config) {
    this.context = config.context;
    this.sequelize = config.sequelize || sequelize;
    this.model = this.sequelize.models[this.modelName];
  }
}

// Define model is used to define the base attributes of a model
// as well as any pre/post hooks.
const defineModel = ({
  modelName,
  attributes,
  resolveType,
  sequelizeOptions = {},
  external = false,
}) => (client = sequelize) => {
  if (attributes.originId || attributes.originType) {
    console.error(
      `originId and originType are reserved attribute names. Use 'external = true' or pick other attributes.`
    );
  }
  const model = client.define(
    modelName,
    {
      ...attributes,
      apollosId: {
        type: DataTypes.STRING,
        allowNull: true, // we set this value with an "afterCreate" hook if not set.
        unique: true,
      },
      apollosType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ...(external
        ? {
            originId: { type: DataTypes.STRING, allowNull: false },
            originType: { type: DataTypes.STRING, allowNull: false },
          }
        : {}),
    },
    {
      ...sequelizeOptions,
      hooks: {
        ...(sequelizeOptions?.hooks || {}),
        beforeValidate: (instance) => {
          // First, compoute the apollos type from the resolve type, if passed.
          if (resolveType && !instance.apollosType) {
            instance.apollosType = resolveType(instance);
          }
          // Second, use the origin id to compute the apollos id (if it exists)
          if (
            instance.originId != null &&
            instance.apollosType != null &&
            !instance.apollosId
          ) {
            instance.apollosId = createGlobalId(
              instance.originId,
              instance.apollosType
            );
          }
        },
        afterCreate: async (instance, options) => {
          if (!instance.apollosId) {
            instance.apollosId = createGlobalId(
              instance.id,
              instance.apollosType
            );
            await instance.save({
              transaction: options.transaction,
            });
          }
        },
      },
      indexes: [
        { unique: true, fields: ['apollosId'] },
        ...(sequelizeOptions?.indexes || []),
      ],
    }
  );

  return model;
};

// Creates a function that returns a function that can be called with sequelize as an argument.
// Used to configure relationships between models.
const configureModel = (callback) => (client = sequelize) =>
  callback({ sequelize: client });

// Replaces DB migrations - alters the tables so they match the structure defined in code.
// Potentially harmful - will clober columns and tables that no longer exist - so use with caution.
const sync = async (options, client = sequelize) =>
  client.sync({ ...options, alter: true });

export { defineModel, configureModel, sequelize, sync, PostgresDataSource };
