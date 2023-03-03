import { ApolloClient, createHttpLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';

import fetch from 'jest-fetch-mock';

import { createResolvers } from './Provider';

jest.mock('react-native-device-info', () => ({
  getUniqueId: () => 'id-123',
  getSystemVersion: () => 'sys-version-123',
  getModel: () => 'ios',
  getVersion: () => 'version-123',
  getBuildNumber: () => 0,
}));

const cache = new InMemoryCache();

const track = jest.fn();

const resolvers = createResolvers({
  trackFunctions: [track],
  identifyFunctions: [track],
});

const client = new ApolloClient({
  link: createHttpLink({ fetch }),
  cache,
  resolvers,
});

describe('Analytics Store', () => {
  afterEach(() => {
    fetch.resetMocks();
    track.mockClear();
  });
  it('tracks an event by calling user provided function and server function', async () => {
    fetch.mockResponse(
      JSON.stringify({ data: { trackEvent: { success: true } } })
    );
    await resolvers.Mutation.track(
      {},
      {
        properties: [{ field: 'ContentId', value: 'Content:123' }],
        eventName: 'TrackSomething',
      },
      { cache: client.cache, client }
    );
    expect(track.mock.calls).toMatchSnapshot('User provided track');
    expect(fetch.mock.calls).toMatchSnapshot('Server track');
  });

  it("doesn't throw an error, if the user passed track function is not a function", async () => {
    fetch.mockResponse(
      JSON.stringify({ data: { trackEvent: { success: true } } })
    );
    const resolversBad = createResolvers({ trackFunctions: ['foo', track] });
    const clientBad = new ApolloClient({
      link: createHttpLink({ fetch }),
      cache,
      resolvers: resolversBad,
    });
    await resolversBad.Mutation.track(
      {},
      {
        properties: [{ field: 'ContentId', value: 'Content:123' }],
        eventName: 'TrackSomething',
      },
      { cache: clientBad.cache, client: clientBad }
    );
    expect(track.mock.calls).toMatchSnapshot('User provided track');
  });

  it("identify's a user by calling user provided function and server function", async () => {
    fetch.mockResponse(
      JSON.stringify({ data: { identifySelf: { success: true } } })
    );
    await resolvers.Mutation.identify({}, {}, { cache: client.cache, client });
    expect(track.mock.calls).toMatchSnapshot('User provided identify');
    expect(fetch.mock.calls).toMatchSnapshot('Server identify');
  });

  it("doesn't throw an error, if the user passed identify function is not a function", async () => {
    fetch.mockResponse(
      JSON.stringify({ data: { identifySelf: { success: true } } })
    );
    const resolversBad = createResolvers({ identifyFunctions: ['foo', track] });
    const clientBad = new ApolloClient({
      link: createHttpLink({ fetch }),
      cache,
      resolvers: resolversBad,
    });
    await resolversBad.Mutation.identify(
      {},
      {},
      { cache: clientBad.cache, client: clientBad }
    );
    expect(track.mock.calls).toMatchSnapshot('User provided identify');
  });
});
