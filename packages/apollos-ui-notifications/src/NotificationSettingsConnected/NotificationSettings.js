import React from 'react';
import PropTypes from 'prop-types';
import { Switch, PaddedView, BackgroundView } from '@apollosproject/ui-kit';

const NotificationSettings = ({
  allNotificationsEnabled,
  toggleNotifications,
}) => (
  <BackgroundView>
    <PaddedView>
      <Switch
        value={allNotificationsEnabled}
        label={'Notifications'}
        onValueChange={() => {
          toggleNotifications();
        }}
      />
    </PaddedView>
  </BackgroundView>
);

NotificationSettings.propTypes = {
  allNotificationsEnabled: PropTypes.bool,
  toggleNotifications: PropTypes.func,
};

NotificationSettings.defaultProps = {
  allNotificationsEnabled: false,
  toggleNotifications: () => null,
};

NotificationSettings.displayName = 'NotificationSettings';

export default NotificationSettings;
