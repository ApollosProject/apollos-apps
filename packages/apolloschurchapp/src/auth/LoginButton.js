import React, { PureComponent } from 'react';
import { withNavigation } from 'react-navigation';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import Button from 'apolloschurchapp/src/ui/Button';
import styled from 'apolloschurchapp/src/ui/styled';
import ActivityIndicator from 'apolloschurchapp/src/ui/ActivityIndicator';

import getLoginState from './getLoginState';

const Login = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
}))(Button);

class LoginButton extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      push: PropTypes.func,
    }),
  };

  handleLoginPress = () => this.props.navigation.push('Auth');

  render() {
    const { navigation, ...otherProps } = this.props;
    return (
      <Query query={getLoginState}>
        {({ data }) => {
          const { isLoggedIn, loading } = data;
          if (loading) return <ActivityIndicator />;
          if (isLoggedIn) return null;
          return (
            <Login
              onPress={this.handleLoginPress}
              title={'Get Connected'}
              {...otherProps}
            />
          );
        }}
      </Query>
    );
  }
}

export default withNavigation(LoginButton);
