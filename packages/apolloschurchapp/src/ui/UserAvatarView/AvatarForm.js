import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query } from 'react-apollo';

import ConnectedImage from 'apolloschurchapp/src/ui/ConnectedImage';
import Touchable from 'apolloschurchapp/src/ui/Touchable';
import { ButtonLink } from 'apolloschurchapp/src/ui/Button';
import Avatar from 'apolloschurchapp/src/ui/Avatar';
import { withTheme } from 'apolloschurchapp/src/ui/theme';
import { H5 } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';
import getUserProfile from '../../tabs/connect/getUserProfile';
import uploadPhoto from './uploadPhoto';

const GetPhotoData = ({ children }) => (
  <Query query={getUserProfile}>
    {({ data: { currentUser = {} } = {} }) => {
      const photoUpdated = get(currentUser, 'profile.photo');
      return children({ photoUpdated });
    }}
  </Query>
);

GetPhotoData.propTypes = {
  children: PropTypes.func.isRequired,
};

const StyledAvatar = withTheme(({ theme }) => ({
  containerStyle: {
    marginRight: 0,
    marginBottom: theme.sizing.baseUnit / 2,
  },
}))(Avatar);

const Wrapper = styled({
  justifyContent: 'center',
  alignItems: 'center',
})(View);

export default class AvatarForm extends PureComponent {
  state = {
    isUploadingFile: false,
  };

  componentWillUnmount() {
    this.setState({ isUploadingFile: false });
  }

  handleUploadPhoto = async () => {
    try {
      await uploadPhoto({
        onUpload: () => this.setState({ isUploadingFile: true }),
      });
      await this.props.refetch();
      await this.setState({ isUploadingFile: false });
    } catch (e) {
      this.setState({ isUploadingFile: false });
    }
  };

  render() {
    const { photo } = this.props;
    const { isUploadingFile } = this.state;

    return (
      <Wrapper>
        <Touchable
          disabled={this.props.disabled}
          onPress={this.handleUploadPhoto}
        >
          <GetPhotoData>
            {({ photoUpdated }) => {
              console.log(photoUpdated);
              return (
                <StyledAvatar
                  source={photoUpdated || photo}
                  size="medium"
                  isLoading={isUploadingFile}
                />
              );
            }}
          </GetPhotoData>
        </Touchable>
        {this.props.text ? (
          <H5>
            <ButtonLink onPress={this.handleUploadPhoto}>
              Change Photo
            </ButtonLink>
          </H5>
        ) : null}
      </Wrapper>
    );
  }
}

AvatarForm.propTypes = {
  refetch: PropTypes.func.isRequired,
  photo: ConnectedImage.propTypes.source,
  disabled: PropTypes.bool,
  text: PropTypes.bool,
};
