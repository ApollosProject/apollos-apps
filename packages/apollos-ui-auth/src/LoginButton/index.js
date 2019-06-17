import React from 'react';
import { Query } from 'react-apollo';

import { Button } from '@apollosproject/ui-kit';

import GET_LOGIN_STATE from '../getLoginState';
import { AuthConsumer } from '../Provider';

const LoginButton = (props) => (
  <Query query={GET_LOGIN_STATE}>
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
