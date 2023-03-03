module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:react/jsx-runtime'],
  env: {
    'jest/globals': true,
    'detox/detox': true,
  },
  plugins: ['detox'],
};
