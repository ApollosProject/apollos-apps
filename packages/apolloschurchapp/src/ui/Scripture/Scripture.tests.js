import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';
import Item from './Item';

describe('the ScriptureItem component', () => {
  it('renders Psalm 119 from html', () => {
    const tree = renderer.create(
      <Providers>
        <Item query={'Psalm 119'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders Song of Solomon 1:1-4 from html', () => {
    const tree = renderer.create(
      <Providers>
        <Item query={'Song of Solomon 1:1-4'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
