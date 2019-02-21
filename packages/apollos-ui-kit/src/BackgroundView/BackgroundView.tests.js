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
  it('should render with custom colors', () => {
    const tree = renderer.create(
      <Providers>
        <BackgroundView colors={['#FF0000', '#0000FF']} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as a solid color', () => {
    const tree = renderer.create(
      <Providers>
        <BackgroundView colors={['#fa8072', '#fa8072']} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept extra props', () => {
    const tree = renderer.create(
      <Providers>
        <BackgroundView locations={[0, 0.5, 0.6]} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
