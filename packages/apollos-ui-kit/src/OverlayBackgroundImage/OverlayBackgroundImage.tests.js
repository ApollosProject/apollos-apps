import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';

import OverlayBackgroundImage from '.';

describe('the OverlayBackgroundImage component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <OverlayBackgroundImage
          source={{ uri: 'https://picsum.photos/600/600' }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render with custom overlay color', () => {
    const tree = renderer.create(
      <Providers>
        <OverlayBackgroundImage
          overlayType="medium"
          overlayColor="red"
          source={{ uri: 'https://picsum.photos/600/600' }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render with custom size', () => {
    const tree = renderer.create(
      <Providers>
        <OverlayBackgroundImage
          overlayColor={null}
          style={{ width: '100%', height: '75%', aspectRatio: undefined }} // eslint-disable-line react-native/no-inline-styles
          source={{ uri: 'https://picsum.photos/600/600' }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
