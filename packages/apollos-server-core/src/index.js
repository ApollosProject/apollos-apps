import url from 'url';
import { compact, mapValues, merge, flatten } from 'lodash';
import { gql } from '@apollo/client';
import { InMemoryLRUCache } from 'apollo-server-caching';
import { makeExecutableSchema } from 'apollo-server';
import { createQueues, UI } from 'bull-board';
import ApollosConfig from '@apollosproject/config';
import basicAuth from 'express-basic-auth';

import * as Node from './node';
import * as Interfaces from './interfaces';
import * as Pagination from './pagination';
import * as Media from './media';
import * as Message from './message';
import * as Upload from './upload';

export { createGlobalId, parseGlobalId, isUuid } from './node';
export {
  createCursor,
  parseCursor,
  withEdgePagination,
} from './pagination/utils';
export { resolverMerge, schemaMerge } from './utils';
export { setupUniversalLinks, generateAppLink } from './linking';
export { useSimpleDonationRoute } from './giving';
export { Interfaces, Node };

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

// Types that all apollos-church servers will use.
const builtInData = { Node, Pagination, Media, Message, Upload };

export const createSchema = (data) => [
  gql`
    type Query {
      _placeholder: Boolean # needed, empty schema defs aren't supported
    }

    type Mutation {
      _placeholder: Boolean # needed, empty schema defs aren't supported
    }
  `,
  ...compact(
    Object.values(
      mapValues({ ...builtInData, ...data }, safeGetWithWarning('schema'))
    )
  ),
];

export const createResolvers = (data) =>
  merge(
    ...compact(
      Object.values(
        mapValues({ ...builtInData, ...data }, safeGetWithWarning('resolver'))
      )
    )
  );

const getDbModels = (data) =>
  mapValues({ ...builtInData, ...data }, safeGetWithWarning('models'));

const getMigrations = (data) =>
  compact(
    flatten(
      Object.values(
        mapValues({ ...builtInData, ...data }, safeGetWithWarning('migrations'))
      )
    )
  );

const getDataSources = (data) =>
  mapValues({ ...builtInData, ...data }, safeGetWithWarning('dataSource'));

// Deprecated - we won't be using this models paradigm going forward.
// All models should be renamed as DataSources.
const getModels = (data) =>
  mapValues({ ...builtInData, ...data }, safeGetWithWarning('model'));

const getContextMiddlewares = (data) =>
  compact(
    Object.values(
      mapValues(
        { ...builtInData, ...data },
        safeGetWithWarning('contextMiddleware')
      )
    )
  );

export const createDataSources = (data) => {
  const dataSources = getDataSources(data);
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

export const setupSequelize = (data) => {
  const models = getDbModels(data);
  // Create all the models first.
  // This ensures they exist in the global model list.
  Object.values(models).forEach(({ createModel } = {}) => {
    if (createModel) {
      createModel();
    }
  });
  // Now setup all the models.
  // This two stage aproach means we can setup circular associations
  // and do other things that would otherwise cause problems with circular imports.
  Object.values(models).forEach(({ setupModel } = {}) => {
    if (setupModel) {
      setupModel();
    }
  });
};

export const createContext = (data) => ({ req = {} } = {}) => {
  const initiatedModels = {};

  // For all non-datasource connectors. Right now only `Node`.
  const models = getModels(data);
  let context = {
    models: initiatedModels,
  };

  Object.keys(models).forEach((modelName) => {
    if (models[modelName]) {
      initiatedModels[modelName] = new models[modelName](context);
    }
  });

  const contextMiddleware = getContextMiddlewares(data);
  contextMiddleware.forEach((middleware) => {
    context = middleware({ req, context });
  });

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

  return context;
};

export const createContextGetter = (serverConfig) => (data) => {
  const testContext = serverConfig.context(data);
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

export const createMiddleware = (data) => ({ app, context, dataSources }) => {
  const middlewares = compact(
    Object.values(
      mapValues(
        { ...builtInData, ...data },
        safeGetWithWarning('serverMiddleware')
      )
    )
  );

  const getContext = createContextGetter({ context, dataSources });

  return middlewares.forEach((middleware) => middleware({ app, getContext }));
};

export const createJobs = (data) => ({ app, context, dataSources }) => {
  const jobs = compact(
    Object.values(
      mapValues({ ...builtInData, ...data }, safeGetWithWarning('jobs'))
    )
  );

  const getContext = createContextGetter({ context, dataSources });

  let queues = {
    add: () => {
      console.log(
        `process.env.REDIS_URL is undefined. Working with job queues/bull is a no-op`
      );
      return { process: () => ({}), add: () => ({}) };
    },
  };

  const redisOptsFromUrl = (urlString) => {
    const redisOpts = {};
    try {
      const redisUrl = url.parse(urlString);
      redisOpts.port = redisUrl.port || 6379;
      redisOpts.host = redisUrl.hostname;
      redisOpts.db = redisUrl.pathname ? redisUrl.pathname.split('/')[1] : 0;
      if (redisUrl.auth) {
        const password = redisUrl.auth.split(':')[1];
        redisOpts.password = password;
      }
    } catch (e) {
      throw new Error(e.message);
    }
    return redisOpts;
  };

  if (process.env.REDIS_URL) {
    queues = createQueues({
      redis: {
        ...redisOptsFromUrl(process.env.REDIS_URL),
        ...(process.env.REDIS_URL.includes('rediss')
          ? {
              tls: {
                rejectUnauthorized: false,
              },
            }
          : {}),
      },
    });
  }

  const jobsPath = '/admin/queues';
  let trigger = () => null;
  if (ApollosConfig.APP.JOBS_USERNAME && ApollosConfig.APP.JOBS_PASSWORD) {
    const auth = basicAuth({
      users: {
        [ApollosConfig.APP.JOBS_USERNAME]: ApollosConfig.APP.JOBS_PASSWORD,
      },
      challenge: true,
    });

    app.use(jobsPath, auth, UI);

    // callback to define a manually triggered job
    trigger = (path, job) => {
      app.post(`${jobsPath}${path}`, auth, (req, res) => {
        job.add(null);
        res.sendStatus(201);
      });
    };
  } else {
    app.get(jobsPath, (req, res) => {
      res.send('Must specify a username and password in the server config');
    });
  }

  return jobs.forEach((create) => create({ app, getContext, queues, trigger }));
};

export const createApolloServerConfig = (data) => {
  // Setup all the DB models
  setupSequelize(data);
  const dataSources = createDataSources(data);
  const schema = createSchema(data);
  const resolvers = createResolvers(data);
  const context = createContext(data);
  const applyServerMiddleware = createMiddleware(data);
  const setupJobs = createJobs(data);
  const migrations = getMigrations(data);
  return {
    context,
    dataSources,
    schema,
    resolvers,
    applyServerMiddleware,
    setupJobs,
    migrations,
  };
};
