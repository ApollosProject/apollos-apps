import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { useIsLoggedIn } from './Provider';

const ProtectedRoute = () => {
  const navigation = useNavigation();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    // if we don't have the logged in state, do nothing
    // we're still showing the splash screen
    if (isLoggedIn == null) {
      return;
    }

    SplashScreen.hide();
    if (isLoggedIn) {
      navigation.replace('Tabs');
    } else {
      navigation.replace('Auth');
    }
  }, [isLoggedIn, navigation]);

  return null;
};

export default ProtectedRoute;
