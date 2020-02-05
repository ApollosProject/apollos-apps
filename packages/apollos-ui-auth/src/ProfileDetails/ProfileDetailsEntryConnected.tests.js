import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '../testUtils';

import ProfileDetailsEntryConnected from './ProfileDetailsEntryConnected';

describe('ui-auth/Profile/ProfileEntryConnected', () => {
  it('should render', () => {
    const navigation = { navigate: jest.fn() };

    const tree = renderer.create(
      <Providers>
        <ProfileDetailsEntryConnected navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
