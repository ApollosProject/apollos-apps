import React from 'react';

import {
  // AirPlayListener,
  AirPlayButton,
  // AirPlay,
} from 'react-native-airplay-btn';

function AirplayControls() {
  // TODO: use a class if we need to know the airplay status for anything later
  /*
//class AirplayControls extends React.Component {
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
    AirPlay.startScan();
  }

  componentWillUnmount() {
    // remove airplay handlers
    this.airPlayConnected.remove();
    this.airPlayAvailable.remove();

    AirPlay.disconnect();
  }

  render() {
  */
  return <AirPlayButton />;
}

export default AirplayControls;
