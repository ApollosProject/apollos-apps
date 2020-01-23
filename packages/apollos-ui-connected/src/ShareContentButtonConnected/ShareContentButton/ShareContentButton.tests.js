import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '../../utils/testUtils';

import ShareContentButton from '.';

describe('the Share component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ShareContentButton onPress={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
