import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { named, H4 } from '@apollosproject/ui-kit';
import GET_USERS_FOLLOWING from './getFollowing';
import FollowListConnected from './FollowListConnected';

const FollowingListConnected = ({
  Component,
  Header,
  refetchRef,
  ...props
}) => {
  const { data, loading, refetch } = useQuery(GET_USERS_FOLLOWING, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (refetch && refetchRef) refetchRef({ refetch, id: 'following-list' });
  }, []);

  const suggestedFollows = data?.usersFollowing || [];

  return (
    <Component
      header={Header}
      loading={loading}
      followers={suggestedFollows}
      {...props}
    />
  );
};

FollowingListConnected.propTypes = {
  // Custom component to be rendered. Defaults to Features
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  Header: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  refetchRef: PropTypes.func,
};

FollowingListConnected.defaultProps = {
  Component: FollowListConnected,
  Header: <H4>{'Following'}</H4>,
};

FollowingListConnected.displayName = 'FollowingListConnected';

export default named('ui-connected.FollowingListConnected')(
  FollowingListConnected
);
