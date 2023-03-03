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
  it('should render with paper color', () => {
    const tree = renderer.create(
      <Providers>
        <BackgroundView material="paper" />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as a system color', () => {
    const tree = renderer.create(
      <Providers>
        <BackgroundView material="system" />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept extra props', () => {
    const bg = { backgroundColor: 'red' };
    const tree = renderer.create(
      <Providers>
        <BackgroundView style={bg} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
