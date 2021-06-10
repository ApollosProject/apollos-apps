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
  try {
    return (await OneSignal.getDeviceState()).hasNotificationPermission;
  } catch (e) {
    console.warn(e);
  }

  try {
    return new Promise((resolve) =>
      OneSignal.getPermissionSubscriptionState((status) =>
        resolve(!!status.notificationsEnabled)
      )
    );
  } catch {}

  return null;
};

const getHasPrompted = async () => {
  // One Signal 4
  try {
    return (
      (await OneSignal.getDeviceState()).notificationPermissionStatus !== 0
    );
  } catch (e) {
    console.warn(e);
  }

  try {
    return new Promise((resolve) =>
      OneSignal.getPermissionSubscriptionState((status) =>
        resolve(status.hasPrompted)
      )
    );
  } catch {}

  return null;
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
