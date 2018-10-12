import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { H3 } from 'apolloschurchapp/src/ui/typography';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import ConnectedImage from 'apolloschurchapp/src/ui/ConnectedImage';
import styled from 'apolloschurchapp/src/ui/styled';
import ChannelLabel from 'apolloschurchapp/src/ui/ChannelLabel';
import AvatarForm from './AvatarForm';


const Container = styled({
  backgroundColor: 'white',
  alignItems: 'center',
  justifyContent: 'flex-start',
  overflow: 'hidden',
  flexDirection: 'row',
})(View);

const Content = styled(({ theme }) => ({
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingVertical: theme.sizing.baseUnit * 0.5,
}))(PaddedView);

const UserAvatarView = enhance(
  ({
    theme,
    photo,
    firstName,
    lastName,
    location,
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
        isLoading={isLoading}
        text={false}
        disabled={disabled}
        photo={photo}
        refetch={refetch}
      />
      <Content>
        <H3>
          {firstName} {lastName}
        </H3>
        <ChannelLabel isLoading={isLoading} icon="pin" label={location} />
      </Content>
    </Container>
  )
);

UserAvatarView.propTypes = {
  photo: ConnectedImage.propTypes.source,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  location: PropTypes.string,
  isLoading: PropTypes.bool,
  refetch: PropTypes.func,
  onPhotoPress: PropTypes.func,
  blurIntensity: PropTypes.number,
  allowProfileImageChange: PropTypes.bool,
  ...View.propTypes,
};

export default UserAvatarView;
