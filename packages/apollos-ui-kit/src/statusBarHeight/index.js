/* eslint-disable react-native/split-platform-components */
import { useEffect, useState } from 'react';
import { NativeModules, StatusBar, StatusBarIOS, Platform } from 'react-native';

function useStatusBarHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      // This module only exists on iOS
      NativeModules.StatusBarManager.getHeight((frame) =>
        setHeight(frame.height)
      );

      const changeListener = StatusBarIOS.addListener(
        'statusBarFrameWillChange',
        (data) => {
          setHeight(data.frame.height);
        }
      );

      return () => changeListener.remove();
    }
    // This property only exists on android.
    setHeight(StatusBar.currentHieght);
    return () => ({});
  }, []);

  return height;
}

export default useStatusBarHeight;
