import React from 'react';
import renderer from 'react-test-renderer';
import Providers from '../Providers';

import FeaturedCard from '.';

describe('FeaturedCard', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <FeaturedCard title={'Boom'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
