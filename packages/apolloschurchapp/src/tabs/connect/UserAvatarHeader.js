import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import UserAvatarView from 'apolloschurchapp/src/ui/UserAvatarView';
import ConnectedImage from 'apolloschurchapp/src/ui/ConnectedImage';
import Icon from 'apolloschurchapp/src/ui/Icon';
import { withTheme } from 'apolloschurchapp/src/ui/theme';
import styled from 'apolloschurchapp/src/ui/styled';

const enhance = compose(withTheme());

const Container = styled({
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
  paddingTop: 60,
  marginLeft: 15,
})(View);

const SettingsButton = styled({
  marginRight: 10,
})(Icon);

const UserAvatarHeader = enhance(
  ({ theme, firstName, lastName, photo, refetch, navigation, disabled }) => (
    <Container>
      <UserAvatarView
        firstName={firstName}
        lastName={lastName}
        photo={photo}
        refetch={refetch}
        disabled={disabled}
      />
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('UserSettings', { photo, refetch })}
      >
        <SettingsButton
          name={'settings'}
          fill={theme.colors.text.tertiary}
          size={32}
        />
      </TouchableWithoutFeedback>
    </Container>
  )
);

UserAvatarHeader.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  photo: ConnectedImage.propTypes.source,
  refetch: PropTypes.func,
};

export default UserAvatarHeader;
