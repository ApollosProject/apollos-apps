import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getHasPrompted, getPushPermissions } from './permissionUtils';

const PushContext = React.createContext({
  hasPrompted: true,
  hasPushPermission: true,
  loading: false,
  update: () => {},
});

class Provider extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      loading: false,
    };
  }

  componentDidMount() {
    getPushPermissions().then((permissionRes) => {
      getHasPrompted().then((promptRes) => {
        this.value = {
          hasPrompted: promptRes,
          hasPushPermission: permissionRes,
          loading: this.state.loading,
          update: this.update,
        };
        this.setState({
          ready: true,
        });
      });
    });
  }

  update = () => {
    this.value = {
      ...this.value,
      loading: true,
    };
    this.setState(
      {
        loading: true,
      },
      () => {
        getPushPermissions().then((permissionRes) => {
          getHasPrompted().then((promptRes) => {
            this.value = {
              ...this.value,
              hasPrompted: promptRes,
              hasPushPermission: permissionRes,
              loading: false,
            };
            this.setState({
              loading: false,
            });
          });
        });
      }
    );
  };

  render() {
    return (
      <PushContext.Provider value={this.value}>
        {this.state.ready && this.props.children}
      </PushContext.Provider>
    );
  }
}

export const PushConsumer = PushContext.Consumer;

export default Provider;
