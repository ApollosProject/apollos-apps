import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';
import { ApolloProvider } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';
import TrackEventWhenLoaded from './TrackEventWhenLoaded';
import AnalyticsProvider from './Provider';

const trackMock = jest.fn();

// eslint-disable-next-line
const Providers = ({ children }) => (
  <ApolloProvider MockedProvider={MockedProvider}>
    <AnalyticsProvider trackFunctions={[trackMock]}>
      {children}
    </AnalyticsProvider>
  </ApolloProvider>
);

describe('The TrackEventWhenLoaded component', () => {
  afterEach(() => {
    trackMock.mockClear();
  });
  it('should track an event if mounted with loaded=true', async () => {
    renderer.create(
      <Providers>
        <TrackEventWhenLoaded
          loaded
          eventName="Track Something"
          properties={{ ThingId: '1234' }}
        />
      </Providers>
    );
    await wait(0);
    expect(trackMock.mock.calls).toMatchSnapshot();
  });

  it('should track an event if mounted with isLoading=false', async () => {
    renderer.create(
      <Providers>
        <TrackEventWhenLoaded
          isLoading={false}
          eventName="Track Something"
          properties={{ ThingId: '1234' }}
        />
      </Providers>
    );
    await wait(0);
    expect(trackMock.mock.calls).toMatchSnapshot();
  });

  it('should track an event if mounted with loaded=false and then switching to true', async () => {
    const tree = renderer.create(
      <Providers>
        <TrackEventWhenLoaded
          loaded={false}
          eventName="Track Something"
          properties={{ ThingId: '1234' }}
          track={trackMock}
          key="tracker"
        />
      </Providers>
    );
    await wait(0);
    expect(trackMock.mock.calls).toMatchSnapshot('mounted');
    tree.update(
      <Providers>
        <TrackEventWhenLoaded
          loaded={false}
          eventName="Track Something"
          properties={{ ThingId: '1234' }}
          track={trackMock}
          key="tracker"
        />
      </Providers>
    );
    await wait(0);
    expect(trackMock.mock.calls).toMatchSnapshot('first update, not loaded');
    tree.update(
      <Providers>
        <TrackEventWhenLoaded
          loaded
          eventName="Track Something"
          properties={{ ThingId: '1234' }}
          track={trackMock}
          key="tracker"
        />
      </Providers>
    );
    await wait(0);
    expect(trackMock.mock.calls).toMatchSnapshot('second update, loaded');
  });

  it('should track an event if mounted with isLoading=true and then switching to false', async () => {
    const tree = renderer.create(
      <Providers>
        <TrackEventWhenLoaded
          isLoading
          eventName="Track Something"
          properties={{ ThingId: '1234' }}
          track={trackMock}
          key="tracker"
        />
      </Providers>
    );
    await wait(0);
    expect(trackMock.mock.calls).toMatchSnapshot('mounted');
    tree.update(
      <Providers>
        <TrackEventWhenLoaded
          isLoading
          eventName="Track Something"
          properties={{ ThingId: '1234' }}
          track={trackMock}
          key="tracker"
        />
      </Providers>
    );
    await wait(0);
    expect(trackMock.mock.calls).toMatchSnapshot('first update, not loaded');
    tree.update(
      <Providers>
        <TrackEventWhenLoaded
          isLoading={false}
          eventName="Track Something"
          properties={{ ThingId: '1234' }}
          track={trackMock}
          key="tracker"
        />
      </Providers>
    );
    await wait(0);
    expect(trackMock.mock.calls).toMatchSnapshot('second update, loaded');
  });
});
