import { get } from 'lodash';
import { createGlobalId } from '@apollosproject/server-core';

export default {
  // deprecated
  WeekendContentItem: {
    features: (root, args, { dataSources: { ContentItem } }) =>
      ContentItem.getFeatures(root),
  },
  // deprecated
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
    id: ({ id }) => createGlobalId(id, 'TextFeature'),
  },
  CardListItem: {
    coverImage: ({ image }) => image,
    title: ({ title }, { hyphenated }, { dataSources: { ContentItem } }) =>
      hyphenated ? ContentItem.createHyphenatedString({ text: title }) : title,
    hasAction: (root, args, { dataSources: { ContentItem } }) =>
      !!get(ContentItem.getVideos(root.relatedNode), '[0].sources[0]', null),
    labelText: ({ subtitle }) => subtitle,
    id: ({ id }) => createGlobalId(id, 'CardListItem'),
  },
  ActionListAction: {
    id: ({ id }) => createGlobalId(id, 'ActionListAction'),
  },
  ActionBarAction: {
    id: ({ id }) => createGlobalId(id, 'ActionBarAction'),
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
    id: ({ id }) => createGlobalId(id, 'ScriptureFeature'),
  },
  Query: {
    userFeedFeatures: async (root, args, { dataSources: { Feature } }) =>
      console.warn('userFeedFeatures is deprecated. Use homeFeedFeatures.') ||
      Feature.getHomeFeedFeatures(),
  },
  ActionListFeature: {
    id: ({ id }) => createGlobalId(id, 'ActionListFeature'),
  },
  ActionBarFeature: {
    id: ({ id }) => createGlobalId(id, 'ActionBarFeature'),
  },
  HeroListFeature: {
    id: ({ id }) => createGlobalId(id, 'HeroListFeature'),
  },
  VerticalCardListFeature: {
    id: ({ id }) => createGlobalId(id, 'VerticalCardListFeature'),
  },
  HorizontalCardListFeature: {
    id: ({ id }) => createGlobalId(id, 'HorizontalCardListFeature'),
  },
  PrayerListFeature: {
    id: ({ id }) => createGlobalId(id, 'PrayerListFeature'),
  },
  VerticalPrayerListFeature: {
    id: ({ id }) => createGlobalId(id, 'VerticalPrayerListFeature'),
  },
};
