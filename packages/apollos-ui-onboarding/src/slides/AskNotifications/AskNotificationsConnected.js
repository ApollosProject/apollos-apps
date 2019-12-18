import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { NotificationsConsumer } from '@apollosproject/ui-notifications';

import AskNotifications from './AskNotifications';

function defaultGetButtonText({ hasPushPermission, hasPrompted }) {
  if (hasPushPermission) {
    return 'Notifications Enabled!';
  }
  if (hasPrompted) {
    return 'Enable Notifications in Settings';
  }
  return 'Yes, enable notifications';
}

// eslint-disable-next-line react/display-name
const AskNotificationsConnected = memo(
  ({
    Component,
    onPressPrimary,
    onPressSecondary,
    onRequestPushPermissions,
    getButtonText,
    ...props
  }) => (
    <NotificationsConsumer>
      {(value) => (
        <Component
          isLoading={value.loading}
          onPressButton={() => onRequestPushPermissions(value.checkPermissions)}
          buttonDisabled={value.hasPushPermission}
          buttonText={getButtonText({
            hasPrompted: value.hasPrompted,
            hasPushPermission: value.hasPushPermission,
          })}
          onPressPrimary={value.hasPrompted ? onPressPrimary : null} // if notifications are enabled show the primary nav button (next/finish)
          onPressSecondary={
            // if notifications are not enabled show the secondary nav button (skip)
            !value.hasPrompted ? onPressSecondary || onPressPrimary : null // if onPressSecondary exists use it else default onPressPrimary
          }
          pressPrimaryEventName={'Ask Notifications Completed'}
          pressSecondaryEventName={'Ask Notifications Skipped'}
          {...props}
        />
      )}
    </NotificationsConsumer>
  )
);

AskNotificationsConnected.propTypes = {
  Component: PropTypes.shape({}),
  onPressPrimary: PropTypes.func,
  onPressSecondary: PropTypes.func,
  onRequestPushPermissions: PropTypes.func.isRequired,
  getButtonText: PropTypes.func,
};

AskNotificationsConnected.defaultProps = {
  Component: AskNotifications,
  getButtonText: defaultGetButtonText,
};

AskNotificationsConnected.displayName = 'AskNotificationsConnected';

export default AskNotificationsConnected;
