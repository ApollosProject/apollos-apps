import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '../testUtils';

import ProfileEntryConnected from './ProfileEntryConnected';

describe('ui-auth/Profile/ProfileEntryConnected', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ProfileEntryConnected />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
