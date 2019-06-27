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
      const personaFeature = await Features.createActionListFeature({
        algorithms: ['PERSONA_FEED'],
        title: 'FOR YOU',
        subtitle: 'Explore what God calls you to today',
      });
      const contentChannelFeature = await Features.createActionListFeature({
        algorithms: [
          { type: 'CONTENT_CHANNEL', arguments: { contentChannelId: 13 } },
        ],
        title: 'BULLETIN',
        subtitle: "What's happening at apollos?",
      });
      return [personaFeature, contentChannelFeature];
    },
  },
};
