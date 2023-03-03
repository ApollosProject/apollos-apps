import React from 'react';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { withTheme } from '@apollosproject/ui-kit';
import { MapViewConnected as Location } from '@apollosproject/ui-mapview';
import { NotificationSettingsConnected } from '@apollosproject/ui-notifications';
import {
  PersonFollowingConnected,
  LikedContentFeedConnected,
} from '@apollosproject/ui-connected';

import PersonalDetails from './PersonalDetails';
import UserSettings from './UserSettings';

const StyledText = withTheme(({ theme }) => ({
  style: {
    color: theme.colors.secondary,
    fontSize: theme.sizing.baseUnit * 1.1,
  },
}))(Text);

const ModalCloseText = () => {
  const navigation = useNavigation();
  const onPress = () => navigation.goBack();
  return (
    <StyledText name={'close'} onPress={onPress}>
      Done
    </StyledText>
  );
};

const { Screen, Navigator } = createNativeStackNavigator();

const UserSettingsNavigator = () => (
  <Navigator
    screenOptions={{
      headerHideShadow: true,
      headerRight: ModalCloseText,
    }}
  >
    <Screen
      component={UserSettings}
      name="UserSettings"
      options={{ title: 'Profile' }}
    />
    <Screen
      name="Location"
      component={Location}
      options={{ title: 'Campuses' }}
    />
    <Screen
      component={NotificationSettingsConnected}
      name="Notifications"
      options={{ title: 'Notification Settings' }}
    />
    <Screen
      name="PersonalDetails"
      component={PersonalDetails}
      options={{ headerRight: () => null, title: 'Personal Details' }}
    />
    <Screen
      component={LikedContentFeedConnected}
      name="LikedContentFeedConnected"
      options={{ title: 'Liked Content' }}
    />
    <Screen
      component={PersonFollowingConnected}
      name="Following"
      options={{ title: '' }}
    />
  </Navigator>
);

export default UserSettingsNavigator;
