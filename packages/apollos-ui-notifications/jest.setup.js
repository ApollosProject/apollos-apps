jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsProvider: ({ children }) => children,
}));

jest.mock('react-native-onesignal', () => ({
  getPermissionSubscriptionState: (callback) =>
    callback({ notificationsEnabled: true, subscriptionEnabled: true }),
  promptForPushNotificationsWithUserResponse: (callback) => callback(true),
  init: jest.fn(),
  addEventListener: jest.fn(),
  configure: jest.fn(),
}));
