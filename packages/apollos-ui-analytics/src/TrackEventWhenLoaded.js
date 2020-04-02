import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AnalyticsConsumer } from './Provider';

class TrackEventWhenLoaded extends PureComponent {
  componentDidMount() {
    if (this.props.loaded || this.props.isLoading === false) {
      this.track();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.loaded && this.props.loaded) ||
      (prevProps.isLoading && !this.props.isLoading)
    ) {
      this.track();
    }
  }

  get trackClient() {
    return this.props.track;
  }

  track() {
    const { eventName, properties } = this.props;
    return this.trackClient({ eventName, properties });
  }

  render() {
    return null;
  }
}

TrackEventWhenLoaded.propTypes = {
  loaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  eventName: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  properties: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  track: PropTypes.func,
};

const TrackEventWhenLoadedConnected = (props) => (
  <AnalyticsConsumer>
    {({ track }) => <TrackEventWhenLoaded {...props} track={track} />}
  </AnalyticsConsumer>
);

export default TrackEventWhenLoadedConnected;
