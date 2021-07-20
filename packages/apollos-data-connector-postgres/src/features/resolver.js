import { get } from 'lodash';
import { createGlobalId } from '@apollosproject/server-core';

const id = (type) => ({ apollosId, id: rootId }) =>
  apollosId || createGlobalId(rootId, type);

const resolver = {
  Feature: {
    // Implementors must attach __typename to root.
    __resolveType: ({ __typename, apollosType }) => __typename || apollosType,
  },
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
  TextFeature: {
    sharing: ({ data }) => ({
      title: 'Share text via...',
      message: data?.text,
    }),
    body: ({ data }) => data.text,
    id: ({ apollosId }) => apollosId,
  },
  ButtonFeature: {
    id: ({ apollosId }) => apollosId,
    action: ({ data }, args, { dataSources: { Feature } }) =>
      Feature.attachActionIds({
        relatedNode: {
          __typename: 'Url',
          url: data.url,
          ...data.relatedNode,
        },
        action: data.action,
        title: data.text,
      }),
  },
  CardListItem: {
    coverImage: ({ image }) => image,
    title: ({ title }, { hyphenated }, { dataSources: { ContentItem } }) =>
      title && hyphenated
        ? ContentItem.createHyphenatedString({ text: title })
        : title,
    hasAction: (root, args, { dataSources: { ContentItem } }) =>
      root.attributes &&
      !!get(ContentItem.getVideos(root.relatedNode), '[0].sources[0]', null),
    labelText: ({ subtitle }) => subtitle,
    id: id('CardListItem'),
  },
  ActionListAction: {
    id: id('ActionListAction'),
  },
  ActionBarAction: {
    id: id('ActionBarAction'),
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
    id: id('ScriptureFeature'),
  },
  Query: {
    userFeedFeatures: async () =>
      console.warn(
        'userFeedFeatures is deprecated and removed. Use tabFeedFeatures.'
      ),
  },
  ActionListFeature: {
    id: id('ActionListFeature'),
  },
  ActionBarFeature: {
    id: id('ActionBarFeature'),
  },
  ActionTableFeature: {
    id: id('ActiontableFeature'),
  },
  HeroListFeature: {
    id: id('HeroListFeature'),
  },
  VerticalCardListFeature: {
    id: id('VerticalCardListFeature'),
  },
  HorizontalCardListFeature: {
    id: id('HorizontalCardListFeature'),
  },
  PrayerListFeature: {
    id: id('PrayerListFeature'),
  },
  VerticalPrayerListFeature: {
    id: id('VerticalPrayerListFeature'),
  },
  CommentListFeature: {
    id: id('CommentListFeature'),
  },
  AddCommentFeature: {
    id: id('AddCommentFeature'),
  },
};

export default resolver;
