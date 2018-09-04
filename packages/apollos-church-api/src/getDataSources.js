import { dataSources } from './data';
import { Analytics, getInterfaces } from './data/analytics';

export default () => {
  const sources = {};
  Object.keys(dataSources).forEach((dataSourceName) => {
    if (dataSources[dataSourceName]) {
      sources[dataSourceName] = new dataSources[dataSourceName]();
    }
  });

  return {
    ...sources,
    UniversalContentItem: sources.ContentItem, // alias
  };
};
