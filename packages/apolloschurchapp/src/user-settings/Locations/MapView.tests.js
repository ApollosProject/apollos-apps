import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import Providers from 'apolloschurchapp/src/Providers';
import RNMapView from './MapView';

describe('Display Native Map with Locations', () => {
  it('Render a native map view', async () => {
    const navigation = {
      navigate: jest.fn(),
      getParam: jest.fn(),
      goBack: jest.fn(),
    };
    const tree = renderer.create(
      <Providers>
        <RNMapView navigation={navigation} />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
