jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  const Easing = {
    exp: jest.fn(),
    out: jest.fn(),
  };

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  Reanimated.Easing = Easing;
  Reanimated.EasingNode = Easing;

  return Reanimated;
});
