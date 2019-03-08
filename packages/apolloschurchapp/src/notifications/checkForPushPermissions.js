import OneSignal from 'react-native-onesignal';

const checkForPushPermissions = async () =>
  new Promise((resolve) =>
    OneSignal.getPermissionSubscriptionState((status) =>
      resolve(!!(status.notificationsEnabled && status.subcriptionEnabled))
    )
  );

export default checkForPushPermissions;
