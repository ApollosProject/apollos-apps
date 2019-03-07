import React from 'react';
import renderer from 'react-test-renderer';
import { Icon } from '@apollosproject/ui-kit';

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
  it('should render with custom background colors', () => {
    const tree = renderer.create(
      <Providers>
        <PermissionsPrompt backgroundColors={['salmon', 'salmon']} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a component for a custom image or graphic', () => {
    const tree = renderer.create(
      <Providers>
        <PermissionsPrompt image={<Icon name={'umbrella'} />} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
