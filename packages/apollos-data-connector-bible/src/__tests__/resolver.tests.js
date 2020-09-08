import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import { createGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';
import {
  themeSchema,
  contentChannelSchema,
  contentItemSchema,
  featuresSchema,
} from '@apollosproject/data-schema';
import * as Scripture from '../index';

ApollosConfig.loadJs({
  BIBLE_API: {
    KEY: '9879dbb7cfe39e4d-01',
    BIBLE_ID: {
      WEB: '9879dbb7cfe39e4d-01',
      KJV: 'de4e12af7f28f599-02',
    },
  },
});

const { getContext, getSchema } = createTestHelpers({ Scripture });

describe('Scripture', () => {
  let schema;
  let context;
  beforeEach(() => {
    schema = getSchema([
      themeSchema,
      contentChannelSchema,
      contentItemSchema,
      featuresSchema,
    ]);
    context = getContext();

    fetch.resetMocks();
    fetch.mockLiveDataSourceApis();
  });

  it('returns a single verse', async () => {
    const query = `
      query {
        scripture (query: "SNG.1.1") {
          id
          html
          reference
          copyright
          version
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('returns multiple verses', async () => {
    const query = `
      query {
        scriptures (query: "1 Peter 1:1 and John 3:16") {
          id
          html
          reference
          copyright
          version
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('returns a verse as by node', async () => {
    const query = `
      query {
        node (id: "${createGlobalId(
          JSON.stringify({ id: 'SNG.1.1', bibleId: '9879dbb7cfe39e4d-01' }),
          'Scripture'
        )}") {
          id
          ... on Scripture {
            html
            reference
            copyright
            version
          }
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
