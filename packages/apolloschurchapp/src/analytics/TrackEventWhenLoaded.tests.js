import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';
import TrackEventWhenLoaded from './TrackEventWhenLoaded';

const trackMock = jest.fn();

describe('The TrackEventWhenLoaded component', () => {
  afterEach(() => {
    trackMock.mockClear();
  });
  it('should track an event if mounted with loaded=true', () => {
    renderer.create(
      <Providers>
        <TrackEventWhenLoaded
          loaded
          eventName="Track Something"
          properties={{ ThingId: '1234' }}
          track={trackMock}
        />
      </Providers>
    );
    expect(trackMock.mock.calls).toMatchSnapshot();
  });

  it('should track an event if mounted with loaded=false and then switching to true', () => {
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
    expect(trackMock.mock.calls).toMatchSnapshot();
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
    expect(trackMock.mock.calls).toMatchSnapshot();
  });
});
