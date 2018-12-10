import { gql } from 'apollo-server';

import { createApolloServerConfig } from '@apollosproject/server-core';

import * as Analytics from '@apollosproject/data-connector-analytics';
import * as Scripture from '@apollosproject/data-connector-bible';
import * as LiveStream from '@apollosproject/data-connector-church-online';
import * as Cloudinary from '@apollosproject/data-connector-cloudinary';
import {
  Followings,
  Interactions,
  RockConstants,
  Family,
  Person,
  ContentItem,
  ContentChannel,
  Sharable,
  Auth,
} from '@apollosproject/data-connector-rock';
import * as Theme from './theme';

const data = {
  Followings,
  ContentChannel,
  ContentItem,
  Person,
  Cloudinary,
  Auth,
  LiveStream,
  Theme,
  Scripture,
  Interactions,
  RockConstants,
  Sharable,
  Analytics,
  Family,
  UniversalContentItem: {
    dataSource: ContentItem.dataSource,
  }, // alias
  DevotionalContentItem: {
    dataSource: ContentItem.dataSource,
  }, // alias
  ContentSeriesContentItem: {
    dataSource: ContentItem.dataSource,
  }, // alias
  MediaContentItem: {
    dataSource: ContentItem.dataSource,
  }, // alias
};

const { dataSources, resolvers, schema, context } = createApolloServerConfig(
  data
);

export { dataSources, resolvers, schema, context };

// the upload Scalar is added
export const testSchema = [
  gql`
    scalar Upload
  `,
  ...schema,
];
