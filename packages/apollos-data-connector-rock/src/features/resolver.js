export default {
  WeekendContentItem: {
    features: (root, args, { dataSources: { ContentItem } }) =>
      ContentItem.getFeatures(root),
  },
  Feature: {
    // Implementors must attach __typename to root.
    __resolveType: ({ __typename }) => __typename,
  },
  Query: {
    userFeedFeatures: async (root, args, context) => {
      const { Features } = context.dataSources;
      // Generate a feature to show the user on the home screen.
      const feature = await Features.createActionListFeature({
        algorithms: ['PERSONA_FEED'],
        title: 'FOR YOU',
        subtitle: 'Explore what God calls you to today',
      });
      return [feature];
    },
  },
};
