import { NativeModules } from 'react-native';

jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsProvider: ({ children }) => children,
}));

jest.mock('react-native-onesignal', () => ({
  getPermissionSubscriptionState: (callback) =>
    callback({ notificationsEnabled: true, subscriptionEnabled: true }),
  init: jest.fn(),
  addEventListener: jest.fn(),
  configure: jest.fn(),
}));

NativeModules.RNGestureHandlerModule = {};
