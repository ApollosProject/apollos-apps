import React from 'react';
import PropTypes from 'prop-types';

import useRequestToFollow from '../hooks/useRequestToFollow';

import { Button, H6, useTheme } from '@apollosproject/ui-kit';
import { ListItemStyles } from '../PersonFollowingConnected.styles';
import { gql } from '@apollo/client';

const RequestButton = ({ personId, onCompleted }) => {
  const theme = useTheme();
  const [requestToFollow, { loading, client }] = useRequestToFollow(personId);

  return (
    <Button
      style={ListItemStyles.button(theme)}
      pill={false}
      disabled={loading}
      type="primary"
      onPress={async () => {
        requestToFollow();
        client.cache.writeFragment({
          id: client.cache.identify({ id: personId, __typename: 'Person' }),
          fragment: gql`
            fragment CurrentUserFollowingFragment on Person {
              id
              currentUserFollowing {
                id
                state
              }
            }
          `,
          data: {
            id: personId,
            currentUserFollowing: {
              id: 'temp-id',
              state: 'REQUESTED',
            },
          },
        });
        onCompleted();
      }}
    >
      <H6>{'Follow'}</H6>
    </Button>
  );
};

RequestButton.propTypes = {
  personId: PropTypes.string.isRequired,
  onCompleted: () => null,
};

export default RequestButton;
