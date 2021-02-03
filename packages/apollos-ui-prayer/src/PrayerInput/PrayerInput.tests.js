import React from 'react';
import renderer from 'react-test-renderer';
import { Providers } from '@apollosproject/ui-test-utils';

import PrayerInput from '.';

describe('The PrayerInput component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerInput />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a custom prompt', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerInput prompt={'Custom prompt text. Boom.'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
