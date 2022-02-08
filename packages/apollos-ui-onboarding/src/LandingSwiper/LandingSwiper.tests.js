import React from 'react';
import renderer from 'react-test-renderer';
import { Providers } from '@apollosproject/ui-test-utils';
import LandingSwiper from '.';

describe('The landing swiper', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <LandingSwiper />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
