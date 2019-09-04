import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';

import SearchInputHeader from '.';

describe('The Onboarding LandingScreen component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <SearchInputHeader />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
