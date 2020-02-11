import OneSignal from 'react-native-onesignal';
import gql from 'graphql-tag';

const getPushPermissions = async () =>
  new Promise((resolve) =>
    OneSignal.getPermissionSubscriptionState((status) =>
      // Ensure the client (notificationsEnabled) && OneSignal (subscriptionEnabled) are boolean values
      resolve(!!status.notificationsEnabled)
    )
  );

const getHasPrompted = async () =>
  new Promise((resolve) =>
    OneSignal.getPermissionSubscriptionState((status) =>
      resolve(status.hasPrompted)
    )
  );

const GET_PUSH_ID = gql`
  query getPushId {
    pushId @client
  }
`;

export { GET_PUSH_ID, getHasPrompted, getPushPermissions };
