import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '../testUtils';

import PasswordEntryConnected from './PasswordEntryConnected';

describe('ui-auth/Password/PasswordEntryConnected', () => {
  it('should render', () => {
    const navigation = { navigate: jest.fn() };

    const tree = renderer.create(
      <Providers>
        <PasswordEntryConnected
          handleForgotPassword={jest.fn()}
          navigation={navigation}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
