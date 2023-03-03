import React from 'react';
import PropTypes from 'prop-types';

import useFollowPerson from '../hooks/useFollowPerson';
import useAcceptFollowRequest from '../hooks/useAcceptFollowRequest';

import { Button, H6, useTheme } from '@apollosproject/ui-kit';
import { ListItemStyles } from '../PersonFollowingConnected.styles';

const ConfirmButton = ({ personId, onCompleted }) => {
  const theme = useTheme();
  const { isFollowingCurrentUser } = useFollowPerson(personId);
  const [
    acceptFollowRequest,
    { loading: mutationLoading },
  ] = useAcceptFollowRequest(personId);
  const disabled = mutationLoading;

  return (
    <Button
      style={ListItemStyles.button(theme)}
      pill={false}
      type="primary"
      onPress={async () => {
        await acceptFollowRequest({
          // use this to immediately offer a follow-up action and avoid complex loading states on buttons
          optimisticResponse: {
            acceptFollowRequest: {
              ...isFollowingCurrentUser,
              state: 'ACCEPTED',
            },
          },
        });
        onCompleted();
      }}
      disabled={disabled}
    >
      <H6>{'Confirm'}</H6>
    </Button>
  );
};

ConfirmButton.propTypes = {
  personId: PropTypes.string.isRequired,
  onCompleted: PropTypes.func,
};

ConfirmButton.defaultProps = {
  onCompleted: () => null,
};

export default ConfirmButton;
