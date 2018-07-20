import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Avatar from 'ui/Avatar';
import { withTheme } from 'ui/theme';
import { H4, BodyText } from 'ui/typography';
import PaddedView from 'ui/PaddedView';
import ConnectedImage from 'ui/ConnectedImage';
import Touchable from 'ui/Touchable';
import styled from 'ui/styled';

const Container = styled(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: theme.colors.darkSecondary,
}))(View);
const Content = styled({ alignItems: 'center', justifyContent: 'center' })(
  PaddedView
);

const copyStyles = styled({
  backgroundColor: 'transparent',
  textAlign: 'center',
});
const Name = copyStyles(H4);
const City = copyStyles(BodyText);

const StyledAvatar = withTheme(({ theme }) => ({
  containerStyle: {
    marginRight: 0,
    marginBottom: theme.sizing.baseUnit / 2,
  },
}))(Avatar);

const UserAvatarView = ({
  user: { photo, firstName, lastName, home = {} } = {},
  isLoading,
  refetch,
  onPhotoPress,
  setIsUploadingFile,
  isUploadingFile,
  ...viewProps
}) => {
  const ImageContainer = Touchable;
  // todo: handle file select stuff
  return (
    <Container {...viewProps}>
      <Content>
        <ImageContainer>
          <StyledAvatar
            source={photo}
            size="large"
            isLoading={isUploadingFile}
          />
        </ImageContainer>
        <Name>
          {firstName} {lastName}
        </Name>
        {home ? <City>{home.city}</City> : null}
      </Content>
    </Container>
  );
};

UserAvatarView.propTypes = {
  user: PropTypes.shape({
    photo: ConnectedImage.propTypes.source,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    home: PropTypes.shape({
      city: PropTypes.string,
    }),
  }),
  isLoading: PropTypes.bool,
  refetch: PropTypes.func,
  onPhotoPress: PropTypes.func,
  blurIntensity: PropTypes.number,
  allowProfileImageChange: PropTypes.bool,
  ...View.propTypes,
};

export default UserAvatarView;
