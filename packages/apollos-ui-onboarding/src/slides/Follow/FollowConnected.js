import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import GET_SUGGESTED_FOLLOWS from './getSuggestedFollows';
import REQUEST_FOLLOW_PERSON from './requestFollowPerson';
import Follow from './Follow';

const FollowConnected = ({ Component, ...props }) => {
  const { data, loading, refetch } = useQuery(GET_SUGGESTED_FOLLOWS);
  const [requestFollowPerson] = useMutation(REQUEST_FOLLOW_PERSON, {
    onCompleted: refetch,
  });
  const suggestedFollows = data?.suggestedFollows || [];
  return (
    <Component
      loading={loading}
      followers={suggestedFollows}
      onFollow={(id) => requestFollowPerson({ variables: { personId: id } })}
      {...props}
    />
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
