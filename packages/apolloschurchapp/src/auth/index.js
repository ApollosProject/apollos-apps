import React from 'react';
import Auth from '@apollosproject/ui-auth';

const AuthWithOnboarding = (props) => (
  <Auth onFinish={() => props.navigation.navigate('Onboarding')} {...props} />
);

AuthWithOnboarding.navigationOptions = Auth.navigationOptions;

export default AuthWithOnboarding;
