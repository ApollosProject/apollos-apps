import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-test-utils';

import EmailEntryConnected from './EmailEntryConnected';

describe('ui-auth/Password/EmailEntryConnected', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <EmailEntryConnected />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
