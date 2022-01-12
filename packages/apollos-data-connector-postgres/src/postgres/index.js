/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import './pgEnum-fix';
import { Sequelize, DataTypes } from 'sequelize';
import ApollosConfig, { fetchChurchConfig } from '@apollosproject/config';

import connectJest from './test-connect';

const sequelizes = {};

const getSequelize = ({ churchSlug }) => {
  if (sequelizes[churchSlug]) {
    return sequelizes[churchSlug];
  }
  if (process.env.NODE_ENV === 'test') {
    const sequelize = connectJest();
    sequelizes[churchSlug] = sequelize;
    return sequelizes[churchSlug];
  }
  const churchConfig = fetchChurchConfig({ churchSlug });
  const sequelize =
    churchConfig.DATABASE?.URL &&
    new Sequelize(churchConfig.DATABASE.URL, {
      ...(churchConfig?.DATABASE?.OPTIONS ||
      churchConfig.DATABASE.URL.includes('localhost')
        ? {}
        : {
            dialectOptions: {
              ssl: { require: true, rejectUnauthorized: false },
            },
          }),
    });
  sequelizes[churchSlug] = sequelize;
  return sequelizes[churchSlug];
};
class PostgresDataSource {
  initialize(config) {
    if (!ApollosConfig?.DATABASE?.URL && process.env.NODE_ENV !== 'test')
      throw new Error('Must specify DATABASE_URL variable!');
    this.context = config.context;
    this.sequelize = getSequelize({
      churchSlug: config.context?.church?.slug,
    });
    this.model = this.sequelize.models[this.modelName];
  }

  getFromId(id, encodedId, { originType = null } = {}) {
    if (originType) {
      return this.model.findOne({
        where: { originId: String(id), originType },
      });
    }
    return this.model.findByPk(id);
  }
}

const UUID_V4_REGEXP = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
);

export const assertUuid = (uuid, caller = '') => {
  if (uuid && !UUID_V4_REGEXP.test(uuid)) {
    throw new Error(
      `ID ${uuid} is not a valid UUID. You are probably passing a Rock (or other) id to ${caller} when it expects a Postgres UUID.`
    );
  }
};

export const isUuid = (uuid) => UUID_V4_REGEXP.test(uuid);

// Define model is used to define the base attributes of a model
// as well as any pre/post hooks.
const defineModel =
  ({
    modelName,
    attributes,
    resolveType,
    sequelizeOptions = {},
    external = false,
  }) =>
  (context) => {
    const sequelize = getSequelize({ churchSlug: context?.church?.slug });
    const model = sequelize.define(
      modelName,
      {
        id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
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
        ...(external
          ? {
              originId: { type: DataTypes.STRING, allowNull: false },
              originType: { type: DataTypes.STRING, allowNull: false },
            }
          : {}),
        ...attributes,
      },
      {
        underscored: true,
        ...sequelizeOptions,
        hooks: {
          ...(sequelizeOptions?.hooks || {}),
          beforeValidate: (instance, options) => {
            if (resolveType && !instance.apollosType) {
              instance.apollosType = resolveType(instance);
            }
            // eslint-disable-next-line no-unused-expressions
            sequelizeOptions?.hooks?.beforeValidate?.(instance, options);
          },
          afterCreate: async (instance, options) => {
            if (!instance.apollosId) {
              instance.apollosId = `${instance.apollosType}:${instance.id}`;
              await instance.save({
                transaction: options.transaction,
              });
            }
          },
        },
        indexes: [
          { unique: true, fields: ['apollos_id'] },
          ...(external
            ? [{ unique: true, fields: ['origin_id', 'origin_type'] }]
            : []),
          ...(sequelizeOptions?.indexes || []),
        ],
      }
    );

    return model;
  };

/**
 * @callback ConfigureModelCallback
 * @param {Object} args
 * @param {import('sequelize').Sequelize} args.sequelize
 */

/**
 * Creates a function that returns a function that can be called with sequelize as an argument.
 * Used to configure relationships between models.
 *
 * @param {ConfigureModelCallback} callback
 */
const configureModel = (callback) => (context) => {
  const sequelize = sequelizes[context?.church?.slug];
  return callback({ sequelize });
};

const sequelize = getSequelize({
  churchSlug: 'global',
});

export {
  defineModel,
  configureModel,
  sequelize,
  PostgresDataSource,
  getSequelize,
};
