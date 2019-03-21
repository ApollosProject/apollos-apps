import React, { memo } from 'react';
import { Query, ApolloConsumer } from 'react-apollo';

import {
  requestPushPermissions,
  getNotificationsEnabled,
} from 'apolloschurchapp/src/notifications';

import AskNotifications from '.';

// eslint-disable-next-line react/display-name
const AskNotificationsConnected = memo((props) => (
  <ApolloConsumer>
    {(client) => (
      <Query query={getNotificationsEnabled}>
        {({ data: { notificationsEnabled = false } = {} }) => (
          <AskNotifications
            onPressButton={() => requestPushPermissions({ client })}
            buttonDisabled={notificationsEnabled}
            buttonText={
              notificationsEnabled
                ? 'Notifications Enabled!'
                : 'Yes, enable notifications'
            }
            {...props}
          />
        )}
      </Query>
    )}
  </ApolloConsumer>
));

export default AskNotificationsConnected;
