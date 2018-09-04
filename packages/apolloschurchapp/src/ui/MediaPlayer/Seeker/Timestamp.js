import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

import { H6 } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';

export const TIME_TEXT_WIDTH = 50;

const TimeText = styled({
  width: TIME_TEXT_WIDTH,
  textAlign: 'center',
  alignItems: 'center',
})(H6);

export default class Timestamp extends PureComponent {
  static propTypes = {
    time: PropTypes.instanceOf(Animated.Value),
  };

  state = {
    time: 0,
  };

  constructor(props) {
    super(props);
    this.listen(props);
  }

  componentWillUpdate(newProps) {
    this.listen(newProps);
  }

  listen = ({ time }) => {
    if (this.listener) this.props.time.removeListener(this.listener);
    this.listener = time.addListener(({ value }) =>
      this.setState({ time: value })
    );
  };

  timestamp = (time) => {
    // Hours, minutes and seconds
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;

    let timestamp = '';

    if (hrs > 0) {
      timestamp += `${hrs}:${mins < 10 ? '0' : ''}`;
    }

    timestamp += `${mins}:${secs < 10 ? '0' : ''}`;
    timestamp += `${Math.round(secs)}`;
    return timestamp;
  };

  render() {
    return <TimeText>{this.timestamp(this.state.time)}</TimeText>;
  }
}
