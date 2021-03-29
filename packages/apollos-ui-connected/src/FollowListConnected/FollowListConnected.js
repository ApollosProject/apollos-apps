import React from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { FollowList } from '@apollosproject/ui-kit';
import REQUEST_FOLLOW from './requestFollow';
import ACCEPT_REQUEST from './acceptFollowRequest';
import IGNORE_REQUEST from './ignoreFollowRequest';

const FollowListConnected = ({ Component, ...props }) => {
  const [requestFollowPerson] = useMutation(REQUEST_FOLLOW);
  const [acceptFollowRequest] = useMutation(ACCEPT_REQUEST);
  const [ignoreFollowRequest] = useMutation(IGNORE_REQUEST);

  const handleFollow = ({ personId }) => {
    return requestFollowPerson({
      variables: { personId },
      optimisticResponse: {
        __typename: 'Mutation',
        requestFollow: {
          __typename: 'Follow',
          state: 'REQUESTED',
          id: null,
        },
      },
      // In a perfect world, we wouldn't need this update.
      // However, since in an initial state, there is likely not an existing person.currentUserFollowing field
      // we have to manually add that field to the user who we are requesting to follow.
      // For other similar requests, like "accepting" and "hiding" we won't have to do this.
      // Apollo will know how to make an in place update using the existing FollowID.
      // If you don't care about the UI updating, or plan on refetching your queries, you can delete this argument ;)
      update: (cache, { data: { requestFollow } }) => {
        cache.modify({
          id: cache.identify({ id: personId, __typename: 'Person' }),
          fields: {
            currentUserFollowing() {
              return requestFollow;
            },
          },
        });
      },
    });
  };

  const handleAccept = ({ personId, requestId }) => {
    return acceptFollowRequest({
      variables: { personId },
      optimisticResponse: {
        __typename: 'Mutation',
        acceptFollowRequest: {
          __typename: 'Follow',
          state: 'ACCEPTED',
          id: requestId,
        },
      },
    });
  };

  const handleIgnore = ({ personId, requestId }) => {
    return ignoreFollowRequest({
      variables: { personId },
      optimisticResponse: {
        __typename: 'Mutation',
        ignoreFollowRequest: {
          __typename: 'Follow',
          state: 'DECLINED',
          id: requestId,
        },
      },
    });
  };
  return (
    <Component
      onFollow={handleFollow}
      onHide={handleIgnore}
      onConfirm={handleAccept}
      {...props}
    />
  );
};

FollowListConnected.propTypes = {
  // Custom component to be rendered. Defaults to Features
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
};

FollowListConnected.defaultProps = {
  Component: FollowList,
};

FollowListConnected.displayName = 'FollowListConnected';

export default FollowListConnected;
