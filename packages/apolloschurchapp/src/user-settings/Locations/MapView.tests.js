import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import Providers from 'apolloschurchapp/src/Providers';
import Location from './index';

describe('Display Native Map with Locations', () => {
  const mockRegion = {
    initialRegion: {
      // roughly show the entire USA by default
      latitude: 39.809734,
      longitude: -98.555618,
      latitudeDelta: 100,
      longitudeDelta: 10,
    },
  };
  it('Render a native map view', async () => {
    const navigation = {
      navigate: jest.fn(),
      getParam: jest.fn(),
      goBack: jest.fn(),
    };
    const tree = renderer.create(
      <Providers>
        <Location navigation={navigation} initialRegion={mockRegion} />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
