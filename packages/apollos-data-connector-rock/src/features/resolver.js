import { get } from 'lodash';

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
  CardListItem: {
    coverImage: ({ image }) => image,
    title: ({ title }, { hyphenated }, { dataSources: { ContentItem } }) =>
      hyphenated ? ContentItem.createHyphenatedString({ text: title }) : title,
    hasAction: (root, args, { dataSources: { ContentItem } }) =>
      !!get(ContentItem.getVideos(root.relatedNode), '[0].sources[0]', null),
    labelText: ({ subtitle }) => subtitle,
  },
  ScriptureFeature: {
    scriptures: (
      { reference, version },
      args,
      { dataSources: { Scripture } }
    ) => Scripture.getScriptures(reference, version),
    sharing: ({ reference }, args, { dataSources: { Feature } }) => ({
      title: 'Share scripture via...',
      message: Feature.getScriptureShareMessage(reference),
    }),
  },
  Query: {
    userFeedFeatures: async (root, args, { dataSources: { Feature } }) =>
      Feature.getHomeFeedFeatures(),
  },
};
