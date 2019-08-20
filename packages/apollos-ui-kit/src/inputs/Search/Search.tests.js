import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import Search from '.';

describe('The Search Input component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <Search />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as disabled', () => {
    const tree = renderer.create(
      <Providers>
        <Search disabled />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom placeholder', () => {
    const tree = renderer.create(
      <Providers>
        <Search placeholder={'💥Custom Placeholder text💥'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
