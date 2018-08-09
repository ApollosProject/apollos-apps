import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '/mobile/Providers';

import VideoPlayer from '.';

describe('the VideoPlayer component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <VideoPlayer
          source={{
            uri:
              'http://embed.wistia.com/deliveries/f14c95b710c203f49551373bd37e9685694d6b5b.bin',
          }}
          thumbnail={'https://picsum.photos/600/400/'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
