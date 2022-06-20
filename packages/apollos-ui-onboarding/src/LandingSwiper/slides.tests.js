import React from 'react';
import renderer from 'react-test-renderer';
import { Providers, WithReactNavigator } from '@apollosproject/ui-test-utils';

import { Intro, Scripture, Prayer, Community } from './slides';

test('should render the slides', () => {
  const tree = renderer.create(
    WithReactNavigator(
      <Providers>
        <Intro />
        <Scripture />
        <Prayer />
        <Community />
      </Providers>
    )
  );

  expect(tree).toMatchSnapshot();
});
