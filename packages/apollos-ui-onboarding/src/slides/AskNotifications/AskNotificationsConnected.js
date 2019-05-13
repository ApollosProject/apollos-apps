import React, { memo } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
// This query is also found in core/permissionUtils. We should refactor into a notifications module.
import { withOnPressAnalytics } from '../../utils';
import getNotificationsEnabled from './getNotificationsEnabled';

import AskNotifications from './AskNotifications';

const AskNotificationsWithAnalytics = withOnPressAnalytics(AskNotifications);
// eslint-disable-next-line react/display-name
const AskNotificationsConnected = memo(
  ({
    onPressPrimary,
    onPressSecondary,
    onRequestPushPermissions,
    ...props
  }) => (
    <Query query={getNotificationsEnabled}>
      {({ data: { notificationsEnabled = false } = {} }) => (
        <AskNotificationsWithAnalytics
          onPressButton={() => onRequestPushPermissions()}
          buttonDisabled={notificationsEnabled}
          buttonText={
            notificationsEnabled
              ? 'Notifications Enabled!'
              : 'Yes, enable notifications'
          }
          onPressPrimary={notificationsEnabled ? onPressPrimary : null} // if notifications are enabled show the primary nav button (next/finish)
          onPressSecondary={
            // if notifications are not enabled show the secondary nav button (skip)
            notificationsEnabled ? null : onPressSecondary || onPressPrimary // if onPressSecondary exists use it else default onPressPrimary
          }
          {...props}
        />
      )}
    </Query>
  )
);

AskNotificationsConnected.propTypes = {
  onPressPrimary: PropTypes.func,
  onPressSecondary: PropTypes.func,
  onRequestPushPermissions: PropTypes.func.isRequired,
};

export default AskNotificationsConnected;
