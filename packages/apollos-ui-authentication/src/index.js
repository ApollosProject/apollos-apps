import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { useNavigation } from '@react-navigation/native';
import { UIText } from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';

import { LandingSwiper } from '@apollosproject/ui-onboarding';
import { LoginContext } from './LoginProvider';
import {
  IdentityEntryConnected,
  IdentityVerificationConnected,
} from './Identity';

import { ProfileEntryConnected as AuthProfileEntryConnected } from './Profile';
import { OpenIDConnected } from './OpenID';

import { IdentityConnectConnected } from './IdentityConnect';
import { IdentityConnectVerificationConnected } from './IdentityConnectVerification';

import { AuthLandingConnected } from './AuthLanding';

const AuthStack = createNativeStackNavigator();

const skipButton = (to) => {
  const SkipButton = () => {
    const navigation = useNavigation();
    return (
      <UIText
        secondary
        onPress={typeof to === 'function' ? to : () => navigation.navigate(to)}
      >
        Skip
      </UIText>
    );
  };
  return SkipButton;
};

const AuthNavigator = ({
  alternateLoginText,
  authTitleText,
  confirmationPromptText,
  confirmationTitleText,
}) => {
  const { closeAuth } = React.useContext(LoginContext);
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          blurEffect: 'systemChromeMaterial',
          backgroundColor: 'transparent',
        },
        headerTranslucent: true,
        headerHideShadow: true,
        headerTitle: '',
        headerBackTitle: 'Back',
        headerShown: true,
      }}
    >
      <AuthStack.Screen
        name="Landing"
        component={LandingSwiper}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Auth"
        component={AuthLandingConnected}
        options={{
          headerRight: skipButton('IdentityEntryConnected'),
        }}
      />
      <AuthStack.Screen
        name="IdentityEntryConnected"
        component={IdentityEntryConnected}
        initialParams={{ alternateLoginText, authTitleText }}
      />
      <AuthStack.Screen
        name="IdentityVerificationConnected"
        component={IdentityVerificationConnected}
        initialParams={{ confirmationTitleText, confirmationPromptText }}
      />
      <AuthStack.Screen
        name="IdentityConnectConnected"
        component={IdentityConnectConnected}
        options={{
          headerRight: skipButton(closeAuth),
        }}
      />
      <AuthStack.Screen
        name="IdentityConnectVerificationConnected"
        component={IdentityConnectVerificationConnected}
      />
      <AuthStack.Screen
        name="AuthProfileEntryConnected"
        component={AuthProfileEntryConnected}
      />
      <AuthStack.Screen name="OpenIDConnected" component={OpenIDConnected} />
    </AuthStack.Navigator>
  );
};

AuthNavigator.propTypes = {
  alternateLoginText: PropTypes.string,
  authTitleText: PropTypes.string,
  confirmationTitleText: PropTypes.string,
  confirmationPromptText: PropTypes.string,
};

export { default as AuthProvider } from './Provider';
export { default as ProtectedRoute } from './ProtectedRoute';

export { default as authLink } from './authLink';
export { default as buildErrorLink } from './buildErrorLink';

export { useIsLoggedIn, useLogout } from './Provider';

export default AuthNavigator;
