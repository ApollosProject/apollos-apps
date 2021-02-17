/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

import './pgEnum-fix';
import { Sequelize, DataTypes } from 'sequelize';
import { Client } from 'pg';
import ApollosConfig from '@apollosproject/config';
import { createGlobalId } from '@apollosproject/server-core';

const sequelizeConfigOptions =
  process.env.NODE_ENV === 'test' ? { logging: false } : {};

const dbName = `${process.env.NODE_ENV || 'development'}`;

/**
 * If no database is configured, create one locally.
 */
const init = async () => {
  try {
    if (!ApollosConfig?.DATABASE?.URL) {
      // If there's no configured DB url, create a local database
      const client = new Client({
        host: 'localhost',
        database: 'postgres',
      });

      console.log('client created, connecting...');

      await client.connect();

      console.log(`connected, creating ${dbName}`);

      try {
        await client.query(`CREATE DATABASE ${dbName}`);
        console.log(`created ${dbName}`);
      } catch {
        // db must already exist
        console.log('already exists');
      } finally {
        await client.end();
        console.log('ending');
      }
    }
  } catch (e) {
    // nothing
  }
};

// Use the DB url from the apollos config if provided.
// Otherwise, use a Postgres database in the server root directory.
const sequelize = new Sequelize(
  ApollosConfig?.DATABASE?.URL || `postgres:localhost/${dbName}`,
  { ...sequelizeConfigOptions, ...(ApollosConfig?.DATABASE?.OPTIONS || {}) }
);

class PostgresDataSource {
  initialize(config) {
    this.context = config.context;
    this.sequelize = sequelize;
    this.model = sequelize.models[this.modelName];
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
}) => () => {
  if (attributes.originId || attributes.originType) {
    console.error(
      `originId and originType are reserved attribute names. Use 'external = true' or pick other attributes.`
    );
  }
  const model = sequelize.define(
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
const configureModel = (callback) => () => callback({ sequelize });

// Replaces DB migrations - alters the tables so they match the structure defined in code.
// Potentially harmful - will clober columns and tables that no longer exist - so use with caution.
const sync = async (options) => sequelize.sync({ ...options, alter: true });

export {
  defineModel,
  configureModel,
  sequelize,
  sync,
  init,
  PostgresDataSource,
};
