import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-test-utils';

import { LoginContext } from '../LoginProvider';
import VerificationConnected from './VerificationConnected';

describe('ui-authentication VerificationConnected', () => {
  it('should render', () => {
    const navigation = { navigate: jest.fn() };

    const tree = renderer.create(
      <Providers>
        <LoginContext.Provider value={{ authType: 'phone' }}>
          <VerificationConnected navigation={navigation} />
        </LoginContext.Provider>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
