import { fetch } from 'apollo-server-env';

import { graphql } from 'graphql';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import ApollosConfig from '@apollosproject/config';
import {
  contentItemSchema,
  themeSchema,
  scriptureSchema,
  contentChannelSchema,
} from '@apollosproject/data-schema';
import * as LiveStream from '../index';

ApollosConfig.loadJs({
  CHURCH_ONLINE: {
    URL: 'https://apollos.churchonline.org/api/v1/',
    MEDIA_URLS: ['https://example.org/video.mp4'],
  },
});
// we import the root-level schema and resolver so we test the entire integration:

const { getSchema, getContext } = createTestHelpers({
  LiveStream,
});
describe('LiveStream', () => {
  let schema;
  let context;
  beforeEach(() => {
    schema = getSchema([
      contentItemSchema,
      themeSchema,
      scriptureSchema,
      contentChannelSchema,
    ]);
    context = getContext();

    fetch.resetMocks();
    fetch.mockLiveDataSourceApis();
  });

  it('returns', async () => {
    const query = `
      query {
        liveStreams {
          isLive
          eventStartTime
          media {
            sources { uri }
          }
          webViewUrl
        }
      }
    `;
    const rootValue = {};
    context.dataSources = {
      ...context.dataSources,
      ContentItem: {
        getActiveLiveStreamContent: jest.fn(() => [
          { id: 1, title: 'this will not resolve or show up in the snap' },
        ]),
      },
    };
    context.dataSources.LiveStream.getAccessToken = () => 'ABC123';
    context.dataSources.LiveStream.post = jest.fn(() => ({
      data: {
        currentService: {
          content: { videoStarted: true },
          startTime: new Date('August 19, 1975 23:15:30 GMT+11:00'),
        },
      },
    }));

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
