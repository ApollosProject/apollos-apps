import React from 'react';
import { Query } from 'react-apollo';

import { Button } from '@apollosproject/ui-kit';

import getLoginState from '../getLoginState';
import { AuthConsumer } from '../Provider';

const LoginButton = (props) => (
  <Query query={getLoginState}>
    {({ data }) => {
      const { isLoggedIn, loading } = data;
      if (isLoggedIn) return null;
      return (
        <AuthConsumer>
          {({ navigateToAuth }) => (
            <Button
              onPress={navigateToAuth}
              title="Get Connected"
              loading={loading}
              {...props}
            />
          )}
        </AuthConsumer>
      );
    }}
  </Query>
);

export default LoginButton;
