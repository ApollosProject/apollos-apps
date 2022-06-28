import React from 'react';
import PropTypes from 'prop-types';

import useFollowPerson from '../hooks/useFollowPerson';
import useIgnoreFollowRequest from '../hooks/useIgnoreFollowRequest';

import { Button, H6, useTheme } from '@apollosproject/ui-kit';
import { ListItemStyles } from '../PersonFollowingConnected.styles';

const HideButton = ({ personId, onCompleted }) => {
  const theme = useTheme();
  const { isFollowingCurrentUser } = useFollowPerson(personId);
  const [ignoreFollowRequest] = useIgnoreFollowRequest(personId);

  return (
    <Button
      style={ListItemStyles.button(theme)}
      pill={false}
      bordered
      onPress={() => {
        ignoreFollowRequest({
          optimisticResponse: {
            ignoreFollowRequest: {
              ...isFollowingCurrentUser,
              state: 'DECLINED',
            },
          },
        });
        onCompleted();
      }}
    >
      <H6>{'Hide'}</H6>
    </Button>
  );
};

HideButton.propTypes = {
  personId: PropTypes.string.isRequired,
  onCompleted: PropTypes.func,
};

HideButton.defaultProps = {
  onCompleted: () => null,
};

export default HideButton;
