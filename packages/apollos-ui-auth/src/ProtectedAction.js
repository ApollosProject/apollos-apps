import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import getLoginState from './getLoginState';

import { AuthConsumer } from './Provider';

class ProtectedAction extends PureComponent {
  queuedActionsToTriggerOnLogin = [];

  static propTypes = {
    children: PropTypes.func,
    loading: PropTypes.bool,
    isLoggedIn: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    action: PropTypes.func.isRequired,
    onTriggerAuth: PropTypes.func,
  };

  componentDidUpdate(oldProps) {
    if (!oldProps.isLoggedIn && this.props.isLoggedIn) {
      this.handleLogin();
    }

    if (
      oldProps.loading &&
      !this.props.loading &&
      !this.props.isLoggedIn &&
      this.queuedActionsToTriggerOnLogin.length
    ) {
      this.triggerLogin();
    }
  }

  handleLogin = () => {
    this.queuedActionsToTriggerOnLogin.forEach((action) => action());
    this.queuedActionsToTriggerOnLogin = [];
  };

  protectedActionHandler = (action) => (...args) => {
    if (this.props.isLoggedIn) {
      action(...args);
    } else {
      this.queuedActionsToTriggerOnLogin.push(action.bind(this, ...args));
      if (!this.props.loading) this.props.onTriggerAuth();
    }
  };

  render() {
    return typeof this.props.children === 'function'
      ? this.props.children(this.protectedActionHandler(this.props.action))
      : this.props.children;
  }
}

const ProtectedActionWithProps = (props) => (
  <AuthConsumer>
    {({ navigateToAuth }) => (
      <Query query={getLoginState}>
        {({ data: { isLoggedIn = false } = {}, loading }) => (
          <ProtectedAction
            onTriggerAuth={navigateToAuth}
            isLoggedIn={isLoggedIn}
            loading={loading}
            {...props}
          />
        )}
      </Query>
    )}
  </AuthConsumer>
);

export default ProtectedActionWithProps;
