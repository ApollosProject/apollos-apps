import { withEdgePagination } from '@apollosproject/server-core';

const resolver = {
  Query: {
    search: async (root, input, { dataSources }) =>
      dataSources.Search.byPaginatedQuery(input),
  },
  SearchResults: {
    edges: (edges) => edges,
    pageInfo: (edges) => withEdgePagination({ edges }),
  },
};

export default resolver;
