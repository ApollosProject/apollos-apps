import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'TestProviders';

import CardTile from 'ui/CardTile';

import TileFeed from './';

describe('The TileFeed component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Providers>
        <TileFeed
          content={[
            {
              id: 'fakeId0',
              title: 'Why Jesus is Timeless',
            },
            {
              id: 'fakeId1',
              title: 'Why Jesus is Timeless',
            },
          ]}
          renderItem={({ item, index }) => (
            <CardTile
              number={index + 1}
              title={item.title}
              isLoading={item.isLoading}
            />
          )}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders empty state', () => {
    const tree = renderer.create(
      <Providers>
        <TileFeed
          refreshing
          content={[]}
          renderItem={({ item, index }) => (
            <CardTile
              number={index + 1}
              title={item.title}
              isLoading={item.isLoading}
            />
          )}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
