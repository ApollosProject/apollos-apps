import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'TestProviders';
import ImageHeader from './';

describe('the ImageHeader component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ImageHeader
          images={[
            {
              uri: 'https://picsum.photos/600/400/?random',
              width: 600,
              height: 400,
            },
          ]}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with an overlayColor', () => {
    const tree = renderer.create(
      <Providers>
        <ImageHeader
          images={[
            {
              uri: 'https://picsum.photos/600/400/?random',
              width: 600,
              height: 400,
            },
          ]}
          imageOverlayColor={'salmon'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
