import React, { createContext, Component } from 'react';
import { Animated } from 'react-native';

const defaultState = {
  duration: new Animated.Value(1),
  currentTime: new Animated.Value(0),
  playableDuration: new Animated.Value(1),
  seekableDuration: new Animated.Value(1),
};

const controlState = () => {};

const PlayheadContext = createContext(defaultState);

const PlayheadControls = createContext(controlState);

export class Provider extends Component {
  state = defaultState;

  get controlState() {
    return {
      onLoad: this.handleLoad,
      onProgress: this.handleProgress,
    };
  }

  handleLoad = ({ duration }) => {
    this.state.duration.setValue(duration);
    this.state.currentTime.setValue(0);
    this.state.playableDuration.setValue(0);
    this.state.seekableDuration.setValue(0);
  };

  handleProgress = ({ currentTime, playableDuration, seekableDuration }) => {
    this.state.currentTime.setValue(currentTime);
    this.state.playableDuration.setValue(playableDuration);
    this.state.seekableDuration.setValue(seekableDuration);
  };

  render() {
    return (
      <PlayheadControls.Provider value={this.controlState}>
        <PlayheadContext.Provider value={this.state} {...this.props} />
      </PlayheadControls.Provider>
    );
  }
}

export const { Consumer: PlayheadConsumer } = PlayheadContext;
export const { Consumer: ControlsConsumer } = PlayheadControls;
