import React, { PureComponent } from 'react';
import { withNavigation } from 'react-navigation';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import Button from 'apolloschurchapp/src/ui/Button';
import ActivityIndicator from 'apolloschurchapp/src/ui/ActivityIndicator';

import getLoginState from './getLoginState';

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
            <Button
              onPress={this.handleLoginPress}
              title="Get Connected"
              {...otherProps}
            />
          );
        }}
      </Query>
    );
  }
}

export default withNavigation(LoginButton);
