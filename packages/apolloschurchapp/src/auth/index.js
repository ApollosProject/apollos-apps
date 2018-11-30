import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, SafeAreaView } from 'react-native';

import {
  FlexedView,
  TabView,
  TabSceneMap as SceneMap,
  H2,
  H5,
  styled,
  Icon,
  ButtonLink,
  withTheme,
} from '@apollosproject/ui-kit';

import { track } from 'apolloschurchapp/src/analytics';

import LoginForm from './login';
import SignUpForm from './signup';

export LoginButton from './LoginButton';
export ProtectedAction from './ProtectedAction';

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(H2);

const StyledH5 = styled(() => ({
  padding: 0,
}))(H5);

const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: theme.colors.primary,
}))(Icon);

const HeaderContainer = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
}))(SafeAreaView);

const Header = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
  paddingBottom: theme.sizing.baseUnit * 1.5,
  flexDirection: 'row',
  alignItems: 'center',
}))(View);

const HeaderText = styled(({ theme }) => ({
  flexDirection: 'column',
  paddingTop: 0,
  paddingBottom: 0,
  paddingRight: 0,
  paddingLeft: theme.sizing.baseUnit,
  marginBottom: 0,
}))(View);

const CancelButton = styled(({ theme }) => ({
  alignSelf: 'flex-end',
  paddingTop: theme.sizing.baseUnit * 0.75,
  paddingRight: theme.sizing.baseUnit,
}))(ButtonLink);

class Auth extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  tabRoutes = [
    { title: 'Sign In', key: 'login' },
    { title: 'Register', key: 'signup' },
  ];

  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func,
    }),
  };

  handleFinish = () => {
    // trigger the auth modal to close
    track({ eventName: 'UserLogin' });
    this.props.navigation.goBack();
  };

  renderLogin = () => <LoginForm onLogin={this.handleFinish} />;

  renderSignup = () => <SignUpForm onSignup={this.handleFinish} />;

  render() {
    return (
      <FlexedView>
        <HeaderContainer>
          <CancelButton onPress={this.handleFinish}>Cancel</CancelButton>
          <Header>
            <BrandIcon />
            <HeaderText>
              <Title>Welcome!</Title>
              <StyledH5>Please sign in to continue</StyledH5>
            </HeaderText>
          </Header>
        </HeaderContainer>
        <TabView
          routes={this.tabRoutes}
          renderScene={SceneMap({
            login: this.renderLogin,
            signup: this.renderSignup,
          })}
        />
      </FlexedView>
    );
  }
}

export default Auth;
