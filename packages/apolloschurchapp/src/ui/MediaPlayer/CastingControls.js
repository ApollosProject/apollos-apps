import React from 'react';
import { Platform, View } from 'react-native';
import { styled, ButtonIcon } from '@apollosproject/ui-kit';
import {
  AirPlayButton,
  // AirPlayListener,
  // AirPlay,
} from 'react-native-airplay-btn';

const CastingContainer = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit * 2,
}))(View);

// TODO: use a class if we need to know the airplay status for anything later
/*
class AirplayControls extends React.Component {
  // Airplay listeners
  airPlayAvailable = AirPlayListener.addListener(
    'airplayAvailable',
    (devices) =>
      this.setState({
        airPlayAvailable: devices.available,
      })
  );

  airPlayConnected = AirPlayListener.addListener(
    'airplayConnected',
    (devices) =>
      this.setState({
        airPlayConnected: devices.available,
      })
  );
  componentDidMount() {
    // AirPlay.startScan();
  }

  componentWillUnmount() {
    // remove airplay handlers
    this.airPlayConnected.remove();
    this.airPlayAvailable.remove();

    AirPlay.disconnect();
  }

  render() {
  return <AirPlayButton />;
  }
}
  */

function CastingControls() {
  return (
    <CastingContainer>
      {Platform.OS === 'ios' ? <AirPlayButton /> : null}
    </CastingContainer>
  );
}
export default CastingControls;
