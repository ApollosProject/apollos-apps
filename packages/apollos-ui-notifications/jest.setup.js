import { NativeModules } from 'react-native';

jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsProvider: ({ children }) => children,
}));

jest.mock('react-native-onesignal', () => ({
  getPermissionSubscriptionState: (callback) =>
    callback({
      notificationsEnabled: true,
      subscriptionEnabled: true,
      hasPrompted: true,
    }),
  init: jest.fn(),
  addEventListener: jest.fn(),
  configure: jest.fn(),
  getDeviceState: () => ({
    notificationsEnabled: true,
    subscriptionEnabled: true,
    hasPrompted: true,
    hasNotificationPermission: true,
  }),
}));

NativeModules.RNGestureHandlerModule = {};

jest.mock('@react-native-community/datetimepicker', () => 'DatePicker');
