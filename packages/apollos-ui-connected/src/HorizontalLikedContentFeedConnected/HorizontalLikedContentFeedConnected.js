import React from 'react';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import { GET_LIKED_CONTENT } from '../LikedContentFeedConnected';

import HorizontalLikedContentFeed from './HorizontalLikedContentFeed';

const HorizontalLikedContentFeedConnected = ({ Component }) => {
  const navigation = useNavigation();
  return (
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
          <Component
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
};

HorizontalLikedContentFeedConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

HorizontalLikedContentFeedConnected.defaultProps = {
  Component: HorizontalLikedContentFeed,
};

export default HorizontalLikedContentFeedConnected;
