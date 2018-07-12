import React from 'react';
import renderer from 'react-test-renderer';
import Providers from 'Providers';

import CenteredView from '.';

describe('the CardTile component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <CenteredView />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
