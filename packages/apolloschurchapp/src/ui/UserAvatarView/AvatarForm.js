import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import ConnectedImage from 'apolloschurchapp/src/ui/ConnectedImage';
import Touchable from 'apolloschurchapp/src/ui/Touchable';
import Avatar from 'apolloschurchapp/src/ui/Avatar';
import { withTheme } from 'apolloschurchapp/src/ui/theme';
import { H6 } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';
import uploadPhoto from './uploadPhoto';

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

const StyledText = styled(({ theme }) => ({
  color: theme.colors.secondary,
}))(H6);

export default class AvatarForm extends PureComponent {
  state = {
    isUploadingFile: false,
  };

  handleUploadPhoto = async () => {
    await uploadPhoto({
      onUpload: () => this.setState({ isUploadingFile: true }),
    });
    await this.props.refetch();
    this.setState({ isUploadingFile: false });
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
          <StyledAvatar
            source={photo}
            size="medium"
            isLoading={isUploadingFile}
          />
        </Touchable>
        {this.props.text ? <StyledText>Change Photo</StyledText> : null}
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
