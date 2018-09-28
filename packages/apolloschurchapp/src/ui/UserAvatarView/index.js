import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { compose } from 'recompose';

import { H3, BodyText } from 'apolloschurchapp/src/ui/typography';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import ConnectedImage from 'apolloschurchapp/src/ui/ConnectedImage';
import styled from 'apolloschurchapp/src/ui/styled';
import Icon from 'apolloschurchapp/src/ui/Icon';
import { withTheme } from 'apolloschurchapp/src/ui/theme';
import AvatarForm from './AvatarForm';

const enhance = compose(withTheme());

const Container = styled({
  backgroundColor: 'white',
  alignItems: 'center',
  justifyContent: 'flex-start',
  overflow: 'hidden',
  flexDirection: 'row',
})(View);

const Content = styled({
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  paddingVertical: 10,
  marginLeft: -10,
})(PaddedView);

const Name = styled(({ theme }) => ({
  fontSize: theme.helpers.rem(1.1),
}))(H3);

const City = styled(({ theme }) => ({
  fontSize: theme.helpers.rem(0.75),
  fontWeight: '800',
  color: theme.colors.text.tertiary,
  lineHeight: 0,
}))(BodyText);

const Location = styled({
  flexDirection: 'row',
})(View);

const UserAvatarView = enhance(
  ({
    theme,
    photo,
    firstName,
    lastName,
    home,
    isLoading,
    refetch,
    onPhotoPress,
    setIsUploadingFile,
    isUploadingFile,
    disabled,
    ...viewProps
  }) => (
    // todo: handle file select stuff
    <Container {...viewProps}>
      <AvatarForm
        text={false}
        disabled={disabled}
        photo={photo}
        refetch={refetch}
      />
      <Content>
        <Name>
          {firstName} {lastName}
        </Name>
        <Location>
          <Icon name={'pin'} fill={theme.colors.text.tertiary} size={16} />
          {home ? <City>{home.city}</City> : <City>No Location Set</City>}
        </Location>
      </Content>
    </Container>
  )
);

UserAvatarView.propTypes = {
  photo: ConnectedImage.propTypes.source,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  home: PropTypes.shape({
    city: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  refetch: PropTypes.func,
  onPhotoPress: PropTypes.func,
  blurIntensity: PropTypes.number,
  allowProfileImageChange: PropTypes.bool,
  ...View.propTypes,
};

export default UserAvatarView;
