const resolver = {
  Query: {
    search: async (root, { query, first, after }, { dataSources }) => {
      const hits = await dataSources.Search.search({ query, first, after });
      return {
        edges: hits.map((hit) => ({
          node: hit,
        })),
      };
    },
  },
};

export default resolver;
