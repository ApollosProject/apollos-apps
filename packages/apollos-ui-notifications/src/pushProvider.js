import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getHasPrompted, getPushPermissions } from './permissionUtils';

export const PushContext = React.createContext({
  hasPrompted: true,
  hasPushPermission: true,
  loading: false,
  checkPermissions: () => {},
});

class Provider extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hasPrompted: null,
      hasPushPermission: null,
      checkPermissions: () => {},
    };
  }

  componentDidMount() {
    getPushPermissions().then((permissionRes) => {
      getHasPrompted().then((promptRes) => {
        this.setState({
          hasPrompted: promptRes,
          hasPushPermission: permissionRes,
          checkPermissions: this.update,
        });
      });
    });
  }

  update = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        getPushPermissions().then((permissionRes) => {
          getHasPrompted().then((promptRes) => {
            this.setState({
              hasPrompted: promptRes,
              hasPushPermission: permissionRes,
              loading: false,
            });
          });
        });
      }
    );
  };

  render() {
    return (
      <PushContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </PushContext.Provider>
    );
  }
}

export const PushConsumer = PushContext.Consumer;

export default Provider;
