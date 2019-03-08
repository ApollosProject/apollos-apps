import React, { memo } from 'react';
import { Query } from 'react-apollo';

import {
  requestPushPermissions,
  getNotificationsEnabled,
} from 'apolloschurchapp/src/notifications';

import AskNotifications from '.';

const AskNotificationsConnected = memo((props) => (
  <Query query={getNotificationsEnabled}>
    {({ data: { notificationsEnabled } }) => (
      <AskNotifications
        onPressButton={requestPushPermissions}
        buttonDisabled={notificationsEnabled}
        {...props}
      />
    )}
  </Query>
));

export default AskNotificationsConnected;
