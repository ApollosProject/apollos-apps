import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-kit';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import AnalyticsProvider from './Provider';
import TrackEventWhenLoaded from './TrackEventWhenLoaded';

jest.mock('react-native-device-info', () => ({
  getUniqueID: () => 'id-123',
  getSystemVersion: () => 'sys-version-123',
  getModel: () => 'ios',
  getVersion: () => 'version-123',
  getBuildNumber: () => 0,
}));

const cache = new InMemoryCache();

const trackMock = jest.fn();

const client = new ApolloClient({
  link: createHttpLink({ fetch: jest.fn() }),
  cache,
  resolvers: {},
});

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

// eslint-disable-next-line
const ProviderStack = ({ children }) => (
  <ApolloProvider client={client}>
    <Providers>
      <AnalyticsProvider trackFunctions={[trackMock]}>
        {children}
      </AnalyticsProvider>
    </Providers>
  </ApolloProvider>
);

describe('The TrackEventWhenLoaded component', () => {
  afterEach(() => {
    trackMock.mockClear();
  });
  it('should track an event if mounted with loaded=true', async () => {
    renderer.create(
      <ProviderStack>
        <TrackEventWhenLoaded
          loaded
          eventName="Track Something"
          properties={{ ThingId: '1234' }}
        />
      </ProviderStack>
    );
    await wait(1000);
    expect(trackMock.mock.calls).toMatchSnapshot();
  });

  it('should track an event if mounted with loaded=false and then switching to true', async () => {
    const tree = renderer.create(
      <ProviderStack>
        <TrackEventWhenLoaded
          loaded={false}
          eventName="Track Something"
          properties={{ ThingId: '1234' }}
          track={trackMock}
          key="tracker"
        />
      </ProviderStack>
    );
    await wait(1000);
    expect(trackMock.mock.calls).toMatchSnapshot('mounted');
    tree.update(
      <ProviderStack>
        <TrackEventWhenLoaded
          loaded={false}
          eventName="Track Something"
          properties={{ ThingId: '1234' }}
          track={trackMock}
          key="tracker"
        />
      </ProviderStack>
    );
    await wait(1000);
    expect(trackMock.mock.calls).toMatchSnapshot('first update, not loaded');
    tree.update(
      <ProviderStack>
        <TrackEventWhenLoaded
          loaded
          eventName="Track Something"
          properties={{ ThingId: '1234' }}
          track={trackMock}
          key="tracker"
        />
      </ProviderStack>
    );
    await wait(1000);
    expect(trackMock.mock.calls).toMatchSnapshot('second update, loaded');
  });
});
