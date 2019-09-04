import {
  createGlobalId,
  withEdgePagination,
} from '@apollosproject/server-core';

const resolver = {
  Query: {
    search: async (root, input, { dataSources }) =>
      dataSources.Search.byPaginatedQuery(input),
  },
  SearchResults: {
    edges: (edges) => edges,
    pageInfo: (edges) => withEdgePagination({ edges }),
  },
  SearchResult: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    relatedNode: ({ id }, _, { models, dataSources }, { schema }) =>
      models.Node.get(id, dataSources, schema),
  },
};

export default resolver;
