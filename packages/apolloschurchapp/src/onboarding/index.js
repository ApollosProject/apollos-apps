import React, { PureComponent } from 'react';
import Onboarding from 'apolloschurchapp/src/ui/Onboarding';

export default class TestingControlPanel extends PureComponent {
  static navigationOptions = () => ({
    title: 'Onboarding',
    header: null,
  });

  render() {
    return <Onboarding />;
  }
}
