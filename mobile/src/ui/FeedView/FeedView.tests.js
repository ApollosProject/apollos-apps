import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'TestProviders';
import FeedView from './';

describe('The FeedView component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Providers>
        <FeedView
          content={[
            {
              id: '1',
              title: 'hi',
              category: 'bob',
              coverImage: [
                {
                  uri: 'https://picsum.photos/600/400/?random',
                  width: 600,
                  height: 400,
                },
              ],
              theme: {
                isLight: true,
                colors: {
                  background: {
                    paper: '#fa8072',
                  },
                },
              },
            },
            {
              id: '2',
              title: 'hi 2',
              category: 'bob 2',
              coverImage: [
                {
                  uri: 'https://picsum.photos/600/400/?random',
                  width: 600,
                  height: 400,
                },
              ],
              theme: {
                isLight: true,
                colors: {
                  background: {
                    paper: '#e9967a',
                  },
                },
              },
            },
          ]}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders empty state', () => {
    const tree = renderer.create(
      <Providers>
        <FeedView isLoading content={[]} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
