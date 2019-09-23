import { compact, mapValues, merge, values } from 'lodash';
import gql from 'graphql-tag';
import { InMemoryLRUCache } from 'apollo-server-caching';
import { makeExecutableSchema } from 'apollo-server';
import { createQueues, UI } from 'bull-board';

import * as Node from './node';
import * as Pagination from './pagination';
import * as Media from './media';

export { createGlobalId, parseGlobalId } from './node';
export {
  createCursor,
  parseCursor,
  withEdgePagination,
} from './pagination/utils';
export { resolverMerge, schemaMerge } from './utils';

// Types that all apollos-church servers will use.
const builtInData = { Node, Pagination, Media };

export const createSchema = (data) => [
  gql`
    type Query {
      _placeholder: Boolean # needed, empty schema defs aren't supported
    }

    type Mutation {
      _placeholder: Boolean # needed, empty schema defs aren't supported
    }
  `,
  ...compact(values({ ...builtInData, ...data }).map((datum) => datum.schema)),
];

export const createResolvers = (data) =>
  merge(
    ...compact(
      values({ ...builtInData, ...data }).map((datum) => datum.resolver)
    )
  );

const getDataSources = (data) =>
  mapValues({ ...builtInData, ...data }, (datum) => datum.dataSource);

const getModels = (data) =>
  mapValues({ ...builtInData, ...data }, (datum) => datum.model);

const getContextMiddlewares = (data) =>
  compact(
    values({ ...builtInData, ...data }).map((datum) => datum.contextMiddleware)
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
      typeDefs: [...createSchema(data), `scalar Upload`],
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
    values({ ...builtInData, ...data }).map((datum) => datum.serverMiddleware)
  );

  const getContext = createContextGetter({ context, dataSources });

  return middlewares.forEach((middleware) => middleware({ app, getContext }));
};

export const createJobs = (data) => ({ app, context, dataSources }) => {
  const jobs = compact(
    values({ ...builtInData, ...data }).map((datum) => datum.jobs)
  );

  const getContext = createContextGetter({ context, dataSources });

  const queues = createQueues();

  app.use('/admin/queues', UI);

  return jobs.forEach((create) => create({ app, getContext, queues }));
};

export const createApolloServerConfig = (data) => {
  const dataSources = createDataSources(data);
  const schema = createSchema(data);
  const resolvers = createResolvers(data);
  const context = createContext(data);
  const applyServerMiddleware = createMiddleware(data);
  const setupJobs = createJobs(data);
  return {
    context,
    dataSources,
    schema,
    resolvers,
    applyServerMiddleware,
    setupJobs,
  };
};
