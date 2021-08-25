import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { get } from 'lodash';

import { H3, styled, PaddedView } from '@apollosproject/ui-kit';
import UserAvatarConnected from '../UserAvatarConnected';
import GET_USER_PROFILE from './getUserProfile';

const Container = styled({
  alignItems: 'center',
  justifyContent: 'center',
})(PaddedView);

const UserAvatarHeader = ({
  buttonIcon,
  message,
  size,
  refetchRef,
  ...props
}) => {
  const navigation = useNavigation();

  const { data, refetch } = useQuery(GET_USER_PROFILE, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (refetch && refetchRef) refetchRef({ refetch, id: 'user-profile' });
  }, []);

  const firstName = get(data, 'currentUser.profile.firstName');

  return (
    <Container>
      <PaddedView horizontal={false}>
        <UserAvatarConnected
          size={size}
          refetchRef={refetchRef}
          buttonIcon={buttonIcon}
          onPressIcon={() => navigation.navigate('UserSettings')}
          {...props}
        />
      </PaddedView>
      <H3>
        {message}
        {firstName ? ` ${firstName}` : ''}!
      </H3>
    </Container>
  );
};

UserAvatarHeader.propTypes = {
  buttonIcon: PropTypes.string,
  message: PropTypes.string,
  onPressIcon: PropTypes.func,
  size: PropTypes.string,
  refetchRef: PropTypes.func,
};

UserAvatarHeader.defaultProps = {
  buttonIcon: 'settings',
  message: 'Hello',
  size: 'large',
};

export default UserAvatarHeader;
