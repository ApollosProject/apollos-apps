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

const oneVerseMock = [
  {
    id: 'SNG.1.1',
    orgId: 'SNG.1.1',
    bibleId: '9879dbb7cfe39e4d-01',
    bookId: 'SNG',
    chapterIds: ['SNG.1'],
    reference: 'Song of Solomon 1:1',
    content:
      '<p class="p"><span data-number="1" class="v">1</span>The Song of songs, which is Solomon’s.</p>',
    copyright: 'PUBLIC DOMAIN',
  },
];

const twoVerseMock = [
  {
    id: '1PE.1.1',
    orgId: '1PE.1.1',
    bibleId: '9879dbb7cfe39e4d-01',
    bookId: '1PE',
    chapterIds: ['1PE.1'],
    reference: '1 Peter 1:1',
    content:
      '<p class="p"><span data-number="1" class="v">1</span>Peter, an apostle of Jesus Christ, to the chosen ones who are living as foreigners in the Dispersion in Pontus, Galatia, Cappadocia, Asia, and Bithynia, </p>',
    copyright: 'PUBLIC DOMAIN',
  },
  {
    id: 'JHN.3.16',
    orgId: 'JHN.3.16',
    bibleId: '9879dbb7cfe39e4d-01',
    bookId: 'JHN',
    chapterIds: ['JHN.3'],
    reference: 'John 3:16',
    content:
      '<p class="p"><span data-number="16" class="v">16</span><span class="wj">For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life. </span></p>',
    copyright: 'PUBLIC DOMAIN',
  },
];

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
          book
          copyright
          version
        }
      }
    `;
    context.dataSources.Scripture.get = jest.fn(() => ({
      data: {
        passages: oneVerseMock,
      },
    }));
    context.dataSources.Scripture.getBook = jest.fn(() => 'Song Of Soloman');
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(context.dataSources.Scripture.get.mock.calls[0]).toMatchSnapshot();
    expect(
      context.dataSources.Scripture.getBook.mock.calls[0]
    ).toMatchSnapshot();
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
    context.dataSources.Scripture.get = jest.fn(() => ({
      data: {
        passages: twoVerseMock,
      },
    }));
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
