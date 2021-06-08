import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import { GET_LIKED_CONTENT } from '../LikedContentFeedConnected';

import HorizontalLikedContentFeed from './HorizontalLikedContentFeed';

const HorizontalLikedContentFeedConnected = ({ Component, refetchRef }) => {
  const navigation = useNavigation();

  const {
    loading,
    data: { likedContent: { edges = [] } = { edges: [] } } = {},
    refetch,
  } = useQuery(GET_LIKED_CONTENT, {
    fetchPolicy: 'cache-and-network',
    variables: { first: 3 },
  });

  useEffect(() => {
    if (refetch && refetchRef) refetchRef({ refetch, id: 'liked-list' });
  }, [refetchRef, refetch]);

  return edges.length ? (
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
  ) : null;
};

HorizontalLikedContentFeedConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  refetchRef: PropTypes.func,
};

HorizontalLikedContentFeedConnected.defaultProps = {
  Component: HorizontalLikedContentFeed,
};

export default HorizontalLikedContentFeedConnected;
