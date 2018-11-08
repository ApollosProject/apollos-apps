import { compact, mapValues, merge, values } from 'lodash';
import gql from 'graphql-tag';
import * as Node from './node';

export { createGlobalId, parseGlobalId } from './node';

// Types that all apollos-church servers will use.
const builtInData = { Node };

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

const getModels = (data) => ({
  ...mapValues({ ...builtInData, ...data }, (datum) => datum.model),
});

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

export const createContext = (data, middleware) => ({ req = {} } = {}) => {
  const initiatedModels = {};

  const models = getModels(data);

  const context = {
    models: initiatedModels,
  };

  Object.keys(models).forEach((modelName) => {
    if (models[modelName]) {
      initiatedModels[modelName] = new models[modelName](context);
    }
  });
  if (middleware && typeof middleware === 'function') {
    return middleware({ req, context });
  }
  return context;
};
