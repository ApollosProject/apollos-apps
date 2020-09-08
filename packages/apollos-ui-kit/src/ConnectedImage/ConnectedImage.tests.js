import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';

import ConnectedImage, { getCachedSources, updateCache } from '.';

describe('the ConnectedImage component', () => {
  it('should render immediately with a network image with a known width and height', () => {
    const tree = renderer.create(
      <Providers>
        <ConnectedImage
          source={{
            uri: 'https://placeholdit.co/i/150x150?bg=eeeeee&fc=577084',
            width: 150,
            height: 150,
          }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should maintain aspect ratio', () => {
    const tree = renderer.create(
      <Providers>
        <ConnectedImage
          source={{
            uri: 'https://placeholdit.co/i/150x150?bg=eeeeee&fc=577084',
            width: 150,
            height: 150,
          }}
          maintainAspectRatio
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a minAspectRatio', () => {
    const tree = renderer.create(
      <Providers>
        <ConnectedImage // should render as short
          source={{
            uri: 'https://picsum.photos/200/200/?random',
            width: 200,
            height: 200,
          }}
          maintainAspectRatio
          minAspectRatio={2}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a maxAspectRatio', () => {
    const tree = renderer.create(
      <Providers>
        <ConnectedImage // should render as tall
          source={{
            uri: 'https://picsum.photos/200/200/?random',
            width: 200,
            height: 200,
          }}
          maintainAspectRatio
          maxAspectRatio={0.5}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render between minAspectRatio and maxAspectRatio', () => {
    const tree = renderer.create(
      <Providers>
        <ConnectedImage // should render square
          source={{
            uri: 'https://picsum.photos/200/200/?random',
            width: 200,
            height: 200,
          }}
          maintainAspectRatio
          minAspectRatio={0.5}
          maxAspectRatio={1.5}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should throw an error if minAspectRatio is used without maintainAspectRatio', () => {
    console.error = jest.fn(); // eslint-disable-line no-console
    renderer.create(
      <Providers>
        <ConnectedImage // should render square
          source={{
            uri: 'https://picsum.photos/200/200/?random',
            width: 200,
            height: 200,
          }}
          minAspectRatio={1.5}
        />
      </Providers>
    );

    expect(console.error.mock.calls).toMatchSnapshot(); // eslint-disable-line no-console
  });
  it('should throw an error if maxAspectRatio is used without maintainAspectRatio', () => {
    console.error = jest.fn(); // eslint-disable-line no-console
    renderer.create(
      <Providers>
        <ConnectedImage // should render square
          source={{
            uri: 'https://picsum.photos/200/200/?random',
            width: 200,
            height: 200,
          }}
          maxAspectRatio={1.5}
        />
      </Providers>
    );

    expect(console.error.mock.calls).toMatchSnapshot(); // eslint-disable-line no-console
  });
  it('should update the cache with image uri and sizes', () => {
    const source = {
      url: '//via.placeholder.com/320x240',
      width: 320,
      height: 240,
    };
    updateCache(source);

    expect(getCachedSources(source)).toContainEqual(
      expect.objectContaining({
        url: '//via.placeholder.com/320x240',
        width: 320,
        height: 240,
      })
    );
  });
});
