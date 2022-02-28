import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';

import { LoginContext } from '../LoginProvider';
import { AuthContext } from '../Provider';
import VerificationConnected from './VerificationConnected';

describe('ui-authentication VerificationConnected', () => {
  it('should render', async () => {
    const navigation = { navigate: jest.fn() };

    const tree = await renderWithApolloData(
      <Providers>
        <AuthContext.Provider value={{ login: jest.fn() }}>
          <LoginContext.Provider value={{ authType: 'phone' }}>
            <VerificationConnected
              navigation={navigation}
              confirmationTitleText="Test"
              values={{ code: '', errors: { code: null } }}
            />
          </LoginContext.Provider>
        </AuthContext.Provider>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
