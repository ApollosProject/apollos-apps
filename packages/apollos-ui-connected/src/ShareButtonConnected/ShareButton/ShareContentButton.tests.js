import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '../../testUtils';

import ShareButton from '.';

describe('the Share component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ShareButton onPress={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
