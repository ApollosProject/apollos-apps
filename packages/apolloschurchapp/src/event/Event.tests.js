import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';

import Event from './Event';

describe('The Onboarding LandingScreen component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <Event
          event={{
            __typename: 'Event',
            id: 'Event:123',
            start: '2019-09-26T15:10:51.200Z',
            end: '2019-09-26T17:10:51.200Z',
            location: 'Willow Creek, Chicago',
            image: { sources: [{ url: 'https://url.com/image.jpg' }] },
          }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
