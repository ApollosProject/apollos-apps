import { graphql } from 'graphql';
import ApollosConfig from '@apollosproject/config';
import { Feature } from '@apollosproject/data-connector-rock';
import {
  featuresSchema,
  scriptureSchema,
  contentItemSchema,
  contentChannelSchema,
  themeSchema,
  sharableSchema,
  prayerSchema,
  peopleSchema,
  campusSchema,
  interactionsSchema,
} from '@apollosproject/data-schema';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';

import * as FeatureFeed from '..';

const { getSchema, getContext } = createTestHelpers({
  Feature,
  FeatureFeed,
});

describe('FeatureFeed', () => {
  let schema;
  let context;
  let rootValue;
  beforeEach(() => {
    schema = getSchema([
      featuresSchema,
      scriptureSchema,
      contentItemSchema,
      contentChannelSchema,
      themeSchema,
      sharableSchema,
      prayerSchema,
      peopleSchema,
      campusSchema,
      interactionsSchema,
    ]);
    context = getContext();
    rootValue = {};

    ApollosConfig.loadJs({
      HOME_FEATURES: [
        {
          algorithms: ['PERSONA_FEED'],
          subtitle: 'Explore what God calls you to today',
          title: 'FOR YOU',
          type: 'HorizontalCardList',
        },
      ],
    });
    context.dataSources.Feature.runAlgorithms = () => [];
  });
  it('should query the home feed', async () => {
    const query = `
      query {
        homeFeedFeatures {
          features {
            id
          }
        }
      }
    `;
    console.log(context);
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
