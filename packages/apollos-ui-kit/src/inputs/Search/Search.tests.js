import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import Search from '.';

describe('The Search Input component', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <Providers>
        <Search />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
