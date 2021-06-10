/* eslint-disable no-empty */

import OneSignal from 'react-native-onesignal';
import gql from 'graphql-tag';
import {
  checkNotifications,
  openSettings,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

const getPushPermissions = async () => {
  // One Signal 4
  if (OneSignal.getDeviceState) {
    return (await OneSignal.getDeviceState()).hasNotificationPermission;
  }
  // One Signal 3
  return new Promise((resolve) =>
    OneSignal.getPermissionSubscriptionState((status) =>
      resolve(!!status.notificationsEnabled)
    )
  );
};

const getHasPrompted = async () => {
  // One Signal 4
  if (OneSignal.getDeviceState) {
    return (
      (await OneSignal.getDeviceState()).notificationPermissionStatus !== 0
    );
  }
  // One Signal 3
  return new Promise((resolve) =>
    OneSignal.getPermissionSubscriptionState((status) =>
      resolve(status.hasPrompted)
    )
  );
};

const GET_PUSH_ID = gql`
  query getPushId {
    pushId @client
  }
`;

const requestPermissions = (updateStatus) => {
  checkNotifications().then((checkRes) => {
    if (checkRes.status === RESULTS.DENIED) {
      requestNotifications(['alert', 'badge', 'sound']).then(() => {
        updateStatus();
      });
    } else {
      openSettings();
    }
  });
};

export { GET_PUSH_ID, getHasPrompted, getPushPermissions, requestPermissions };
