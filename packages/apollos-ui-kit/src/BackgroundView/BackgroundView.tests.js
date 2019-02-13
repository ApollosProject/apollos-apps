import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';

import BackgroundView from '.';

describe('The BackgroundView component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <BackgroundView />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render with a red to blue gradient', () => {
    const tree = renderer.create(
      <Providers>
        <BackgroundView colors={['#FF0000', '#0000FF']} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
