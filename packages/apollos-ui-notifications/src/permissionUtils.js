import OneSignal from 'react-native-onesignal';
import gql from 'graphql-tag';
import {
  checkNotifications,
  openSettings,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

const getPushPermissions = async () =>
  console.warn(
    'getPushPermissions is depricated. Use OneSignal.getDeviceState() '
  ) || (await OneSignal.getDeviceState()).hasNotificationPermission;

const getHasPrompted = async () =>
  console.warn(
    'getHasPrompted is depricated. Use OneSignal.getDeviceState() '
  ) || (await OneSignal.getDeviceState()).notificationPermissionStatus !== 0;

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
