import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';

import GradientOverlayImage from '.';

describe('the GradientOverlayImage component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <GradientOverlayImage
          source={[
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
        <GradientOverlayImage
          source={[
            {
              uri: 'https://picsum.photos/600/400/?random',
              width: 600,
              height: 400,
            },
          ]}
          overlayColor={'salmon'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with overlayType.high', () => {
    const tree = renderer.create(
      <Providers>
        <GradientOverlayImage
          source={[
            {
              uri: 'https://picsum.photos/600/400/?random',
              width: 600,
              height: 400,
            },
          ]}
          overlayColor={'salmon'}
          overlayType={'high'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with overlayType.medium', () => {
    const tree = renderer.create(
      <Providers>
        <GradientOverlayImage
          source={[
            {
              uri: 'https://picsum.photos/600/400/?random',
              width: 600,
              height: 400,
            },
          ]}
          overlayColor={'salmon'}
          overlayType={'medium'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with overlayType.low', () => {
    const tree = renderer.create(
      <Providers>
        <GradientOverlayImage
          source={[
            {
              uri: 'https://picsum.photos/600/400/?random',
              width: 600,
              height: 400,
            },
          ]}
          overlayColor={'salmon'}
          overlayType={'low'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with overlayType.gradient-top', () => {
    const tree = renderer.create(
      <Providers>
        <GradientOverlayImage
          source={[
            {
              uri: 'https://picsum.photos/600/400/?random',
              width: 600,
              height: 400,
            },
          ]}
          overlayColor={'salmon'}
          overlayType={'gradient-top'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with overlayType.gradient-bottom', () => {
    const tree = renderer.create(
      <Providers>
        <GradientOverlayImage
          source={[
            {
              uri: 'https://picsum.photos/600/400/?random',
              width: 600,
              height: 400,
            },
          ]}
          overlayColor={'salmon'}
          overlayType={'gradient-bottom'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with overlayType.featured', () => {
    const tree = renderer.create(
      <Providers>
        <GradientOverlayImage
          source={[
            {
              uri: 'https://picsum.photos/600/400/?random',
              width: 600,
              height: 400,
            },
          ]}
          overlayColor={'salmon'}
          overlayType={'featured'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
