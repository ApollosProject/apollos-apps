import { gql } from 'apollo-server';
import { get } from 'lodash';

import {
  createResolvers,
  createSchema,
  createContext,
  createDataSources,
} from '@apollosproject/server-core';

import RockConstants from '../connectors/rock/rock-constants';
import { registerToken } from './auth/token';

import * as ContentChannel from './content-channels';
import * as ContentItem from './content-items';
import * as Person from './people';
import * as Media from './media';
import * as Auth from './auth';
import * as LiveStream from './live';
import * as Theme from './theme';
import * as Scripture from './bible';
import * as Interactions from './interactions';
import * as Sharable from './sharable';
import * as Analytics from './analytics';
import * as Family from './family';
import * as Pagination from './pagination';

const data = {
  ContentChannel,
  ContentItem,
  Person,
  Media,
  Auth,
  LiveStream,
  Theme,
  Scripture,
  Interactions,
  RockConstants: { dataSource: RockConstants },
  Sharable,
  Analytics,
  Family,
  Pagination,
  UniversalContentItem: {
    model: ContentItem.model,
    dataSource: ContentItem.dataSource,
  }, // alias
  DevotionalContentItem: {
    model: ContentItem.model,
    dataSource: ContentItem.dataSource,
  }, // alias
};
// UniversalContentItem: ContentItem.model, // alias

export const dataSources = createDataSources(data);
export const resolvers = createResolvers(data);
export const schema = createSchema(data);
export const context = createContext(data, ({ req, context: ctx }) => {
  if (get(req, 'headers.authorization')) {
    const { userToken, rockCookie, sessionId } = registerToken(
      req.headers.authorization
    );
    if (sessionId) {
      return {
        ...ctx,
        userToken,
        rockCookie,
        sessionId,
      };
    }
  }
  return ctx;
});

// the upload Scalar is added
export const testSchema = [
  gql`
    scalar Upload
  `,
  ...schema,
];
