import { Platform, Dimensions, useWindowDimensions } from 'react-native';

const useOptimizedWindowDimensions = () => {
  let window = useWindowDimensions();

  // So, guess what? lovely react-native has some inconsistencies in ios and
  // android in how both window and screen are reported. And, on Android,
  // Dimensions.get('window') and useWindowDimensions() behave differently.
  // To make matters worse, when we transition to fullscreen on android the
  // status bar and home bar hide, and updating window is quite delayed.
  // So...we're going to make some assumptions and clean this up.
  if (Platform.OS === 'android') {
    let screen = Dimensions.get('screen');

    const windowIsLandscape = window.width > window.height;
    const screenIsLandscape = screen.width > screen.height;
    if (windowIsLandscape !== screenIsLandscape) {
      screen = { ...screen, width: screen.height, height: screen.width };
    }

    // now, update window sizes with whatever dimensions are the largest
    // this cleans up the status bar / home bar hiding delays
    window.width = Math.max(window.width, screen.width);
    window.height = Math.max(window.height, screen.height);
  }

  return window;
};

export default useOptimizedWindowDimensions;
