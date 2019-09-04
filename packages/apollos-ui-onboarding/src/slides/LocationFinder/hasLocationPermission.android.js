import { PermissionsAndroid } from 'react-native';

export default async () =>
  PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
