import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { get } from 'lodash';

import { H3, styled, PaddedView } from '@apollosproject/ui-kit';
import UserAvatarConnected from '../UserAvatarConnected';
import GET_USER_PROFILE from './getUserProfile';

const GetUserProfile = ({ children }) => (
  <Query query={GET_USER_PROFILE}>
    {({ data: { currentUser = {} } = {} }) => {
      const firstName = get(currentUser, 'profile.firstName');
      return children({ firstName });
    }}
  </Query>
);

GetUserProfile.propTypes = {
  children: PropTypes.func.isRequired,
};

const Container = styled({
  alignItems: 'center',
  justifyContent: 'center',
})(PaddedView);

const UserAvatarHeader = ({ navigation }) => (
  <Container>
    <PaddedView horizontal={false}>
      <UserAvatarConnected
        size="large"
        buttonIcon="settings"
        onPressIcon={() => navigation.navigate('UserSettings')}
      />
    </PaddedView>
    <GetUserProfile>
      {({ firstName }) => (
        <H3>
          Hello
          {firstName ? ` ${firstName}` : ''}!
        </H3>
      )}
    </GetUserProfile>
  </Container>
);

UserAvatarHeader.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default withNavigation(UserAvatarHeader);
