/* eslint-disable no-console */
import { compact, mapValues, merge, flatten } from 'lodash';
import { gql, makeExecutableSchema } from 'apollo-server';
import { InMemoryLRUCache } from 'apollo-server-caching';

import * as Node from './node';
import * as Interfaces from './interfaces';
import * as Pagination from './pagination';
import * as Media from './media';
import * as Message from './message';
import * as Upload from './upload';
import * as Sharable from './sharable';
import * as Linking from './linking';
import * as Theme from './theme';

export { useSimpleDonationRoute } from './giving';
export { createGlobalId, parseGlobalId, isUuid } from './node';
export {
  createCursor,
  parseCursor,
  withEdgePagination,
} from './pagination/utils';
export { resolverMerge, schemaMerge } from './utils';
export { setupUniversalLinks, generateAppLink } from './linking';
export {
  Node,
  Interfaces,
  Pagination,
  Media,
  Message,
  Upload,
  Sharable,
  Linking,
  Theme,
};

// Pulls the subdomain out of a domain.
export const parseOrigin = (origin) => {
  const originRegex = /https?:\/\/([\w-]+)\..*/i;
  const matches = origin.match(originRegex);
  if (matches && matches[1]) {
    return matches[1];
  }
  return null;
};

const safeGetWithWarning = (name) => (data, key) => {
  if (data == null) {
    console.warn(
      `The ${key} data object is null.
      Check to make sure you are importing ${key} from the correct package
      or that your packages are up to date.
      `
    );
    return null;
  }
  return data[name];
};

export const createSchema = (data) => [
  gql`
    type Query {
      _placeholder: Boolean # needed, empty schema defs aren't supported
    }

    type Mutation {
      _placeholder: Boolean # needed, empty schema defs aren't supported
    }
  `,
  ...compact(Object.values(mapValues(data, safeGetWithWarning('schema')))),
];

export const createResolvers = (data) =>
  merge(
    ...compact(Object.values(mapValues(data, safeGetWithWarning('resolver'))))
  );

export const createDataSources = (data) => {
  const dataSources = mapValues(data, safeGetWithWarning('dataSource'));
  return () => {
    const sources = {};
    Object.keys(dataSources).forEach((dataSourceName) => {
      if (dataSources[dataSourceName]) {
        sources[dataSourceName] = new dataSources[dataSourceName]();
      }
    });
    return sources;
  };
};

export const setupSequelize = (data, context) => {
  const models = mapValues(data, safeGetWithWarning('models'));
  // Create all the models first.
  // This ensures they exist in the global model list.
  Object.values(models).forEach(({ createModel } = {}) => {
    if (createModel) {
      createModel(context);
    }
  });
  // Now setup all the models.
  // This two stage aproach means we can setup circular associations
  // and do other things that would otherwise cause problems with circular imports.
  Object.values(models).forEach(({ setupModel } = {}) => {
    if (setupModel) {
      setupModel(context);
    }
  });
};

export const createContext =
  (data) =>
  async ({ req = {} } = {}) => {
    const initiatedModels = {};

    // For all non-datasource connectors. Right now only `Node`.
    const models = mapValues(data, safeGetWithWarning('model'));
    let context = {
      models: initiatedModels,
    };

    Object.keys(models).forEach((modelName) => {
      if (models[modelName]) {
        initiatedModels[modelName] = new models[modelName](context);
      }
    });

    const contextMiddlewares = compact(
      Object.values(mapValues(data, safeGetWithWarning('contextMiddleware')))
    );
    // disabling the linter here because it's warning about performance
    // but these are async anyway so it's negligible
    // eslint-disable-next-line
    for (const middleware of contextMiddlewares) {
      // eslint-disable-next-line
      context = await middleware({ req, context });
    }

    // Used to execute graphql queries from within the schema itself. #meta
    // You probally should avoid using this.
    try {
      const schema = makeExecutableSchema({
        typeDefs: [
          ...createSchema(data),
          `
      enum CacheControlScope {
        PUBLIC
        PRIVATE
      }
      directive @cacheControl(
        maxAge: Int
        scope: CacheControlScope
      ) on FIELD_DEFINITION | OBJECT | INTERFACE
      `,
        ],
        resolvers: createResolvers(data),
      });
      context.schema = schema;
    } catch (e) {
      // Not compatible with our test environment under certain conditions
      // Hence, we need to swallow errors.
      console.warn(e);
    }

    setupSequelize(data, context);

    return context;
  };

export const createContextGetter =
  (serverConfig) =>
  async (data, initialContext = {}) => {
    const builtContext = await serverConfig.context(data);
    const testContext = { ...initialContext, ...builtContext };
    const testDataSources = serverConfig.dataSources();

    // Apollo Server does this internally.
    const cache = new InMemoryLRUCache();
    Object.values(testDataSources).forEach((dataSource) => {
      if (dataSource.initialize) {
        dataSource.initialize({
          context: testContext,
          cache,
        });
      }
    });
    testContext.dataSources = testDataSources;
    return testContext;
  };

export const createMiddleware =
  (data) =>
  ({ app, context, dataSources }) => {
    const middlewares = compact(
      Object.values(mapValues(data, safeGetWithWarning('serverMiddleware')))
    );

    const getContext = createContextGetter({ context, dataSources });

    return middlewares.forEach((middleware) => middleware({ app, getContext }));
  };

export const createApolloServerConfig = (data) => {
  const dataSources = createDataSources(data);
  setupSequelize(data, { church: { slug: 'global' } });
  const schema = createSchema(data);
  const resolvers = createResolvers(data);
  const context = createContext(data);
  const applyServerMiddleware = createMiddleware(data);
  const migrations = compact(
    flatten(Object.values(mapValues(data, safeGetWithWarning('migrations'))))
  );
  return {
    context,
    dataSources,
    schema,
    resolvers,
    applyServerMiddleware,
    migrations,
  };
};
