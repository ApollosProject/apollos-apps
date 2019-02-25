import React from 'react';
import renderer from 'react-test-renderer';

import { H1 } from '@apollosproject/ui-kit';

import Providers from 'apolloschurchapp/src/Providers';

import Screen from '.';

describe('The Onboarding Screen component', () => {
  it('should render children', () => {
    const tree = renderer.create(
      <Providers>
        <Screen>
          <H1>Boom</H1>
        </Screen>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
