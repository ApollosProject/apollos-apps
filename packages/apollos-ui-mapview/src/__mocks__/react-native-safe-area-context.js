module.exports = {
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: jest.requireActual('react-native').View,
};
