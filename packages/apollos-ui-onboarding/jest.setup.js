jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsProvider: ({ children }) => children,
  AnalyticsConsumer: ({ children }) => children({ track: jest.fn() }),
}));

jest.mock('react-navigation', () => {
  const ActualNavigation = require.requireActual('react-navigation');
  return {
    ...ActualNavigation,
    SafeAreaView: require.requireActual('SafeAreaView'),
  };
});

jest.mock('DatePickerIOS', () => 'DatePicker');
