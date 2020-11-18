import * as React from 'react';
import {
  View,
  Platform,
  requireNativeComponent,
  ViewProps,
} from 'react-native';

type AirPlayButtonProps = ViewProps & {
  activeTintColor?: string;
  tintColor?: string;
  style?: React.CSSProperties;
};

let AirPlayButton: React.FunctionComponent<AirPlayButtonProps> = () => null;

if (Platform.OS === 'ios') {
  const RNAirPlayButton = requireNativeComponent<AirPlayButtonProps>(
    'RNAirPlayButton'
  );

  AirPlayButton = ({ style, ...otherProps }) => (
    <View style={style}>
      <RNAirPlayButton style={style} {...otherProps} />
    </View>
  );
}

export default AirPlayButton;
