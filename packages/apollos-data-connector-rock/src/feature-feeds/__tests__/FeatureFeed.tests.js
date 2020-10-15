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
      DISCOVER_FEATURES: [
        {
          algorithms: ['CONTENT_CHANNEL'],
          title: 'Content',
        },
      ],
    });
    context.dataSources.Feature.runAlgorithms = () => [];
  });
  it('should query the home feed', async () => {
    const query = `
      query {
        homeFeedFeatures {
          id
          features {
            id
          }
        }
      }
    `;
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
  it('should query the discover feed', async () => {
    const query = `
      query {
        discoverFeedFeatures {
          id
          features {
            id
          }
        }
      }
    `;
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
  it('should get a specific feed', async () => {
    const query = `
       query {
         node(id: "FeatureFeed:c7035fd9677aa209cd4613df53e9c83a0fb3b9ecd853808383d135407161a17b98645698d03097766084632c51ea2eb271dbdadb1205a7012706cfd3d3a513fb") {
           ... on FeatureFeed {
             features {
               id
             }
           }
         }
       }
   `;
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
  it('should handle sources other than the config', async () => {
    expect(
      await context.dataSources.FeatureFeed.getFeed({
        type: 'content',
        args: { id: 123 },
      })
    ).toMatchSnapshot();
  });
  it('should handle a config source with an invalid section', async () => {
    expect(
      await context.dataSources.FeatureFeed.getFeed({
        type: 'apollosConfig',
        args: { section: 'INVALID' },
      })
    ).toMatchSnapshot();
  });
  it('should handle a config source with no section', async () => {
    expect(
      await context.dataSources.FeatureFeed.getFeed({ type: 'apollosConfig' })
    ).toMatchSnapshot();
  });
});
