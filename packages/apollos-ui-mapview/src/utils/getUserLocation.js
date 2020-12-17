/* eslint-disable react-native/split-platform-components */
import {
  Alert,
  Linking,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';

// Taken almost verbatum from `react-native-geolocation-service`s example app.
const hasLocationPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    Alert.alert(`Turn on Location Services to determine your location.`, '', [
      { text: 'Go to Settings', onPress: openSetting },
      { text: "Don't Use Location", onPress: () => {} },
    ]);
  }

  if (status === 'disabled') {
    Alert.alert(`Turn on Location Services to determine your location.`, '', [
      { text: 'Go to Settings', onPress: openSetting },
      { text: "Don't Use Location", onPress: () => {} },
    ]);
  }

  return false;
};

const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasLocationPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG
    );
  }

  return false;
};

const getUserLocation = async () => {
  const hasPermission = await hasLocationPermission();

  if (!hasPermission) {
    return null;
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        console.warn(error);
        reject(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  });
};

export { getUserLocation as default, hasLocationPermission };
