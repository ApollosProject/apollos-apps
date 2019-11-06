import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import getLiveContent from './getLiveContent';

const { Provider, Consumer } = React.createContext([]);

const LiveProvider = (props) => (
  <Query query={getLiveContent} pollInterval={30000}>
    {({ data: { liveStreams = [] } = {} }) => (
      <Provider value={liveStreams}>{props.children}</Provider>
    )}
  </Query>
);

LiveProvider.propTypes = { children: PropTypes.node };

export { LiveProvider, Consumer as LiveConsumer };
