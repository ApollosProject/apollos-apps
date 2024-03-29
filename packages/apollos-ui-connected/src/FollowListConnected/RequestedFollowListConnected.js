import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { named, FeatureTitles } from '@apollosproject/ui-kit';
import GET_REQUESTED_FOLLOWS from './getRequestedFollows';
import FollowListConnected from './FollowListConnected';

const RequestedFollowListConnected = ({
  Component,
  Header,
  refetchRef,
  ...props
}) => {
  const { data, loading, refetch } = useQuery(GET_REQUESTED_FOLLOWS, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (refetch && refetchRef) {
      refetchRef({ refetch, id: 'requested-follow-list' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const followRequests = data?.followRequests || [];

  return (
    <Component
      header={<Header />}
      loading={loading}
      followers={followRequests}
      {...props}
    />
  );
};

RequestedFollowListConnected.propTypes = {
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

RequestedFollowListConnected.defaultProps = {
  Component: FollowListConnected,
  Header: () => <FeatureTitles subtitle={'Follow Requests'} />, // eslint-disable-line react/display-name
};

RequestedFollowListConnected.displayName = 'SuggestedFollowListConnected';

export default named('ui-connected.SuggestedFollowListConnected')(
  RequestedFollowListConnected
);
