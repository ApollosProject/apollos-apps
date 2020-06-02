import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import AvatarCloud from '.';

describe('The AvatarCloud component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarCloud />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
