import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { NotificationsConsumer } from '@apollosproject/ui-notifications';

import AskNotifications from './AskNotifications';

function defaultGetButtonText({ hasPushPermission, hasPrompted }) {
  if (hasPushPermission) {
    return 'Notifications Enabled!';
  }
  // iOS only, hasPrompted is undefined in Android
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
      {(value) => {
        // Android has no concept of push prompt, notifications enabled by default.
        // so we'll just show them it's enabled and allow to proceed
        const ready =
          value.hasPrompted === undefined
            ? value.hasPushPermission || value.hasPrompted
            : value.hasPushPermission;

        return (
          <Component
            isLoading={value.loading}
            onPressButton={() =>
              onRequestPushPermissions(value.checkPermissions)
            }
            buttonDisabled={value.hasPushPermission}
            buttonText={getButtonText({
              hasPrompted: value.hasPrompted,
              hasPushPermission: value.hasPushPermission,
            })}
            onPressPrimary={ready ? onPressPrimary : null}
            onPressSecondary={
              // if onPressSecondary exists use it else default onPressPrimary
              !ready ? onPressSecondary || onPressPrimary : null
            }
            pressPrimaryEventName={'Ask Notifications Completed'}
            pressSecondaryEventName={'Ask Notifications Skipped'}
            {...props}
          />
        );
      }}
    </NotificationsConsumer>
  )
);

AskNotificationsConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
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
