import React, { memo } from 'react';
import { Query } from 'react-apollo';
import getCurrentCampus from './getCurrentCampus';
import LocationFinder from '.';

const AskNotificationsConnected = memo((props) => (
  <Query query={getCurrentCampus}>
    {({ data: { notificationsEnabled = false } = {} }) => (
      <LocationFinder
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
