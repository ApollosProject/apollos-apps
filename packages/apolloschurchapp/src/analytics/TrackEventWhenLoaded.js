import React, { PureComponent } from 'react';
import { ApolloConsumer } from 'react-apollo';
import PropTypes from 'prop-types';
import { track } from './index';

class TrackEventWhenLoaded extends PureComponent {
  componentDidMount() {
    if (this.props.loaded) {
      this.track();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.loaded && this.props.loaded) {
      this.track();
    }
  }

  get trackClient() {
    return this.props.track || track;
  }

  track() {
    const { eventName, properties, client } = this.props;
    return this.trackClient({ eventName, properties, client });
  }

  render() {
    return null;
  }
}

TrackEventWhenLoaded.propTypes = {
  loaded: PropTypes.bool.isRequired,
  eventName: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  properties: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  client: PropTypes.any,
  track: PropTypes.func,
};

const TrackEventWhenLoadedConnected = (props) => (
  <ApolloConsumer>
    {(client) => <TrackEventWhenLoaded {...props} client={client} />}
  </ApolloConsumer>
);

export default TrackEventWhenLoadedConnected;
