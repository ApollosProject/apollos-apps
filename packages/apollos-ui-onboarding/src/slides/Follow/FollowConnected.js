import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';

import GET_SUGGESTED_FOLLOWS from './getSuggestedFollows';
import Follow from './Follow';

const FollowConnected = ({ Component, ...props }) => {
  const { data, loading } = useQuery(GET_SUGGESTED_FOLLOWS, {
    fetchPolicy: 'cache-and-network',
  });
  const suggestedFollows = data?.suggestedFollows || [];
  return (
    <Component loading={loading} followers={suggestedFollows} {...props} />
  );
};

FollowConnected.propTypes = {
  // Custom component to be rendered. Defaults to Features
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
};

FollowConnected.defaultProps = {
  Component: Follow,
};

FollowConnected.displayName = 'FollowConnected';

export default FollowConnected;
