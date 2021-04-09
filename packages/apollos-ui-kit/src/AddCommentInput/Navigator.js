import React from 'react';
import PropTypes from 'prop-types';

import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { withTheme } from '../theme';
import Editor from './Editor';
import Confirmation from './Confirmation';

const Stack = createNativeStackNavigator();

const Navigator = ({
  bottomSheetModalRef,
  bottomSheetIndex,
  editorTitle,
  confirmationTitle,
  onSubmit,
  profile,
  prompt,
  initialValue,
  showCancel,
  ...navigatorProps
}) => {
  return (
    <NavigationContainer independent>
      <Stack.Navigator {...navigatorProps}>
        <Stack.Screen name="Editor">
          {(props) => (
            <Editor
              bottomSheetModalRef={bottomSheetModalRef}
              bottomSheetIndex={bottomSheetIndex}
              image={profile?.photo}
              prompt={prompt}
              headerTitle={editorTitle}
              initialValue={initialValue}
              showCancel={showCancel}
              {...props}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Confirmation"
          options={{
            headerShown: true,
            headerTitle: confirmationTitle,
            headerBackTitle: 'Edit',
          }}
        >
          {(props) => (
            <Confirmation
              bottomSheetModalRef={bottomSheetModalRef}
              profile={profile}
              onSubmit={onSubmit}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

Navigator.propTypes = {
  prompt: PropTypes.string,
  initialValue: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    photo: PropTypes.shape({ uri: PropTypes.string }),
    nickName: PropTypes.string,
  }),
  bottomSheetModalRef: PropTypes.shape({
    current: PropTypes.shape({}),
  }),
  editorTitle: PropTypes.string,
  confirmationTitle: PropTypes.string,
  bottomSheetIndex: PropTypes.shape({}),
  showCancel: PropTypes.bool,
};

const EnhancedNavigator = withTheme(({ theme, ...props }) => ({
  ...props,
  initialRouteName: 'Editor',
  screenOptions: {
    safeAreaInsets: { top: 0 },
    headerTintColor: theme.colors.action.secondary,
    headerTitleStyle: {
      color: theme.colors.text.primary,
    },
    headerStyle: {
      backgroundColor: theme.colors.background.paper,
    },
  },
}))(Navigator);

export default EnhancedNavigator;
