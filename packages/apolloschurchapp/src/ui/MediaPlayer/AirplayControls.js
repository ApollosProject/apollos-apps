import React from 'react';

import {
  // AirPlayListener,
  AirPlayButton,
  AirPlay,
} from 'react-native-airplay-btn';

class AirplayControls extends React.Component {
  // TODO: use these if we need to know the status for anything
  // Airplay listeners
  /*
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
  */
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
    return <AirPlayButton />;
  }
}

export default AirplayControls;
