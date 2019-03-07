import React, { PureComponent } from 'react';
import { View, Platform } from 'react-native';
import Color from 'color';
import OneSignal from 'react-native-onesignal';
import Config from 'react-native-config';
import PropTypes from 'prop-types';

import {
  withTheme,
  styled,
  BackgroundView,
  Icon,
} from '@apollosproject/ui-kit';

const ThemedBackgroundView = withTheme(({ theme, colors }) => ({
  colors: colors || [
    theme.colors.primary,
    Color(theme.colors.primary).darken(0.2),
  ],
}))(BackgroundView);

const ArrowPositioning = styled({
  width: '100%',
  height: '50%',
  alignItems: 'flex-end',
  paddingTop: '28%',
  paddingRight: Platform.OS === 'ios' ? '30.5%' : '23.5%',
})(View);

const ImageWrapper = styled({
  width: '100%',
  height: '50%',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingBottom: '12%',
})(View);

class PermissionsPrompt extends PureComponent {
  static propTypes = {
    backgroundColors: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.node,
  };

  componentDidMount() {
    // this.requestCameraPermissionAndroid();
    // OneSignal.init(Config.ONE_SIGNAL_KEY, {
    //   kOSSettingsKeyAutoPrompt: true,
    // });
    OneSignal.promptLocation();
  }

  render() {
    return (
      <ThemedBackgroundView colors={this.props.backgroundColors}>
        {this.props.image ? (
          <ImageWrapper>{this.props.image}</ImageWrapper>
        ) : null}
        <ArrowPositioning>
          <Icon name={'arrow-up'} fill={'white'} />
        </ArrowPositioning>
      </ThemedBackgroundView>
    );
  }
}

export default PermissionsPrompt;
