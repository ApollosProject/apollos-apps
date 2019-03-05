import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';

import PermissionsPrompt from '.';

describe('The Onboarding PermissionsPrompt component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <PermissionsPrompt />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom background colors', () => {
    const tree = renderer.create(
      <Providers>
        <PermissionsPrompt backgroundColors={['salmon', 'salmon']} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
