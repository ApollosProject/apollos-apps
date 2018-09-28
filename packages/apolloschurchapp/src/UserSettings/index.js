import React, { PureComponent } from 'react';

import { Text } from 'react-native';

class UserSettings extends PureComponent {
  static navigationOptions = () => ({
    title: 'Settings',
  });

  render() {
    return <Text>Hi</Text>;
  }
}

export default UserSettings;
