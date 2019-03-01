import React from 'react';
import { Query } from 'react-apollo';

import { Button } from '@apollosproject/ui-kit';

import getLoginState from '../getLoginState';
import { TriggerAuthConsumer } from '../Provider';

const LoginButton = (props) => (
  <Query query={getLoginState}>
    {({ data }) => {
      const { isLoggedIn, loading } = data;
      if (isLoggedIn) return null;
      return (
        <TriggerAuthConsumer>
          {(triggerLogin) => (
            <Button
              onPress={triggerLogin}
              title="Get Connected"
              loading={loading}
              {...props}
            />
          )}
        </TriggerAuthConsumer>
      );
    }}
  </Query>
);

export default LoginButton;
