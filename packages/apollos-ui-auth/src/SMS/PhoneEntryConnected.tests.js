import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-test-utils';

import PhoneEntryConnected from './PhoneEntryConnected';

describe('ui-auth/SMS/PhoneEntryConnected', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <PhoneEntryConnected />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
