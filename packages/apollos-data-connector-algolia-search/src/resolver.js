import { withEdgePagination } from '@apollosproject/server-core';

const resolver = {
  Query: {
    search: async (root, input, { dataSources }) =>
      dataSources.Search.byPaginatedQuery(input),
  },
  SearchResultsConnection: {
    edges: (edges) => edges,
    pageInfo: (edges) => withEdgePagination({ edges }),
  },
  SearchResult: {
    node: ({ id }, _, { models, dataSources }, { schema }) =>
      models.Node.get(id, dataSources, schema),
  },
};

export default resolver;
