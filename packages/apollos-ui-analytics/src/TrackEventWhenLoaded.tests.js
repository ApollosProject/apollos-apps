import React from 'react';
import renderer from 'react-test-renderer';
import TrackEventWhenLoaded from './TrackEventWhenLoaded';
import { ProviderStack, wait, trackMock } from './testUtils';

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

  it('should track an event if mounted with isLoading=false', async () => {
    renderer.create(
      <ProviderStack>
        <TrackEventWhenLoaded
          isLoading={false}
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

  it('should track an event if mounted with isLoading=true and then switching to false', async () => {
    const tree = renderer.create(
      <ProviderStack>
        <TrackEventWhenLoaded
          isLoading
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
          isLoading
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
          isLoading={false}
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
