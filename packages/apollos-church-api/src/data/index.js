import { gql } from 'apollo-server';

import { createApolloServerConfig } from '@apollosproject/server-core';

import * as Analytics from '@apollosproject/data-connector-analytics';
import * as Scripture from '@apollosproject/data-connector-bible';
import * as LiveStream from '@apollosproject/data-connector-church-online';
import * as Cloudinary from '@apollosproject/data-connector-cloudinary';
import * as OneSignal from '@apollosproject/data-connector-onesignal';
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
  PersonalDevice,
} from '@apollosproject/data-connector-rock';
import * as Theme from './theme';

// This module is used to attach Rock User updating to the OneSignal module.
// This module includes a Resolver that overides a resolver defined in `OneSignal`
import * as OneSignalWithRock from './oneSignalWithRock';

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
  OneSignal,
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
  PersonalDevice,
  OneSignalWithRock,
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
