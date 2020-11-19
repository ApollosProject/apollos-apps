import React from 'react';
import { Query } from '@apollo/client/react/components';

import { Button } from '@apollosproject/ui-kit';

import { GET_LOGIN_STATE } from '../queries';
import { AuthConsumer } from '../Provider';

const LoginButton = (props) => (
  <Query query={GET_LOGIN_STATE}>
    {({ data, loading }) => {
      if (loading) {
        return <Button title="Get Connected" loading={loading} {...props} />;
      }
      const { isLoggedIn } = data;
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
