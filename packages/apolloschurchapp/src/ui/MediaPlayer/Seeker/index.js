import React, { PureComponent } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import styled from 'apolloschurchapp/src/ui/styled';

import { PlayheadConsumer } from '../PlayheadState';
import AnimatedTime, { TIME_TEXT_WIDTH } from './Timestamp';

const Container = styled({
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})(View);

const Track = styled(({ theme, minimal }) => ({
  backgroundColor: minimal
    ? theme.colors.transparent
    : theme.colors.darkSecondary,
  borderRadius: minimal ? 0 : theme.sizing.borderRadius,
  overflow: 'hidden',
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
}))(View);

const TrackContainer = styled(({ theme, minimal }) => ({
  position: 'absolute',
  left: minimal ? 0 : TIME_TEXT_WIDTH,
  right: minimal ? 0 : TIME_TEXT_WIDTH,
  height: theme.sizing.borderRadius,
}))(View);

const Knob = styled(({ theme, minimal }) => {
  const size = minimal ? 0 : theme.sizing.borderRadius * 2;
  return {
    backgroundColor: theme.colors.text.primary,
    borderRadius: size,
    position: 'absolute',
    top: -(size / 2) + theme.sizing.borderRadius / 2,
    right: -(size / 2),
    height: size,
    width: size,
    elevation: 2,
  };
})(View);

const ProgressBar = styled(({ theme }) => ({
  backgroundColor: theme.colors.secondary,
  ...StyleSheet.absoluteFillObject,
}))(View);

class Seeker extends PureComponent {
  static propTypes = {
    minimal: PropTypes.bool,
    currentTime: PropTypes.any, // eslint-disable-line
    duration: PropTypes.any, // eslint-disable-line
    style: PropTypes.any, // eslint-disable-line
  };

  width = new Animated.Value(0);

  offsetDriver = new Animated.Value(0); // todo: for scrubbing eventually

  handleTrackContainerLayout = Animated.event([
    { nativeEvent: { layout: { width: this.width } } },
  ]);

  get trackBarOffset() {
    const progress = Animated.divide(
      this.props.currentTime,
      this.props.duration
    );

    const progressInvert = Animated.subtract(1, progress);
    const widthInvert = Animated.multiply(-1, this.width);
    const position = Animated.multiply(progressInvert, widthInvert);
    return Animated.add(position, this.offsetDriver);
  }

  get knobStyles() {
    return [
      StyleSheet.absoluteFill,
      {
        overflow: 'visible',
        transform: [{ translateX: this.trackBarOffset }],
      },
    ];
  }

  get progressBarStyles() {
    return [
      StyleSheet.absoluteFill,
      {
        transform: [{ translateX: this.trackBarOffset }],
      },
    ];
  }

  renderProgress = () => (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          transform: [{ translateX: this.trackBarOffset }],
        },
      ]}
    >
      <ProgressBar />
    </Animated.View>
  );

  render() {
    return (
      <Container style={this.props.style}>
        {!this.props.minimal ? (
          <AnimatedTime time={this.props.currentTime} />
        ) : null}
        <TrackContainer minimal={this.props.minimal}>
          <Track
            onLayout={this.handleTrackContainerLayout}
            minimal={this.props.minimal}
          >
            {this.renderProgress()}
          </Track>
          <Animated.View style={this.knobStyles}>
            <Knob minimal={this.props.minimal} />
          </Animated.View>
        </TrackContainer>
        {!this.props.minimal ? (
          <AnimatedTime time={this.props.duration} />
        ) : null}
      </Container>
    );
  }
}

const SeekerWithState = (props) => (
  <PlayheadConsumer>
    {(playhead) => <Seeker {...props} {...playhead} />}
  </PlayheadConsumer>
);

export default SeekerWithState;
