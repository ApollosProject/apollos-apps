import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import { GET_LIKED_CONTENT } from '../LikedContentFeedConnected';

import HorizontalLikedContentFeed from './HorizontalLikedContentFeed';

const HorizontalLikedContentFeedConnected = ({ navigation }) => (
  <Query
    query={GET_LIKED_CONTENT}
    fetchPolicy="cache-and-network"
    variables={{ first: 3 }}
  >
    {({
      loading,
      data: { likedContent: { edges = [] } = { edges: [] } } = {},
    }) => {
      if (!edges.length) return null;
      return (
        <HorizontalLikedContentFeed
          id={'liked'}
          name={'Recently Liked'}
          content={edges.map((e) => e.node)}
          isLoading={loading}
          navigation={navigation}
          loadingStateObject={{
            title: 'Recently Liked',
            isLoading: true,
          }}
        />
      );
    }}
  </Query>
);

HorizontalLikedContentFeedConnected.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default HorizontalLikedContentFeedConnected;
