import { NativeModules } from 'react-native';
import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';

ApollosConfig.loadJs({ FRAGMENTS });

jest.mock('react-native-maps');

jest.mock('react-native-geolocation-service', () => {});
NativeModules.RNGestureHandlerModule = {
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
  forceTouchAvailable: jest.fn(),
  State: {},
  Directions: {},
};

jest.mock('@react-native-community/datetimepicker', () => 'DatePicker');
