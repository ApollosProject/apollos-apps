export default {
  WeekendContentItem: {
    features: (root, args, { dataSources: { ContentItem } }) =>
      ContentItem.getFeatures(root),
  },
  ContentSeriesContentItem: {
    features: (root, args, { dataSources: { ContentItem } }) =>
      ContentItem.getFeatures(root),
  },
  Feature: {
    // Implementors must attach __typename to root.
    __resolveType: ({ __typename }) => __typename,
  },
  TextFeature: {
    sharing: ({ body }) => ({
      title: 'Share text via...',
      message: body,
    }),
  },
  ScriptureFeature: {
    scriptures: ({ reference }, args, { dataSources: { Scripture } }) =>
      Scripture.getScriptures(reference),
    sharing: ({ reference }, args, { dataSources: { Features } }) => ({
      title: 'Share scripture via...',
      message: Features.getScriptureShareMessage(reference),
    }),
  },
  Query: {
    userFeedFeatures: async (root, args, { dataSources: { Features } }) =>
      Features.getHomeFeedFeatures(),
  },
};
