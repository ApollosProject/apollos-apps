import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-kit';

import Marker from '.';

const region = {
  latitude: 39.809734,
  longitude: -98.555618,
};

const styles = { opacity: 0.35 };

describe('<Marker>', () => {
  it('should render as a Marker', () => {
    const tree = renderer.create(
      <Providers>
        <Marker
          latitude={region.latitude}
          longitude={region.longitude}
          onPress={jest.fn()}
          opacityStyle={styles}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
