import React, { memo } from 'react';
import { Query } from 'react-apollo';

import {
  requestPushPermissions,
  getNotificationsEnabled,
} from 'apolloschurchapp/src/notifications';

import AskNotifications from '.';

// eslint-disable-next-line react/display-name
const AskNotificationsConnected = memo((props) => (
  <Query query={getNotificationsEnabled}>
    {({ data: { notificationsEnabled = false } = {} }) => (
      <AskNotifications
        onPressButton={requestPushPermissions}
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
));

export default AskNotificationsConnected;
