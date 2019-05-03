jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsProvider: ({ children }) => children,
}));

jest.mock('react-navigation', () => {
  const ActualNavigation = require.requireActual('react-navigation');
  return {
    ...ActualNavigation,
    SafeAreaView: require.requireActual('SafeAreaView'),
  };
});

jest.mock('DatePickerIOS', () => 'DatePicker');
