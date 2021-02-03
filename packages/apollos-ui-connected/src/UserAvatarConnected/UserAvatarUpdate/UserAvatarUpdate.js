import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { ApolloConsumer } from '@apollo/client';

import { PaddedView, styled } from '@apollosproject/ui-kit';

import UserAvatarConnected from '../UserAvatarConnected';

import uploadPhoto from '../../utils/uploadPhoto';

const Wrapper = styled(
  {
    justifyContent: 'center',
    alignItems: 'center',
  },
  'ui-connected.UserAvatarConnected.UserAvatarUpdate.UserAvatarUpdate.Wrapper'
)(View);

class UserAvatarUpdate extends PureComponent {
  static propTypes = {
    buttonIcon: PropTypes.string,
    size: PropTypes.string,
  };

  static defaultProps = {
    buttonIcon: 'camera',
    size: 'large',
  };

  state = {
    isUploadingFile: false,
  };

  componentWillUnmount() {
    this.setState({ isUploadingFile: false });
  }

  handleUploadPhoto = async ({ client }) => {
    try {
      await uploadPhoto({
        client,
        onUpload: () => this.setState({ isUploadingFile: true }),
      });
      await this.setState({ isUploadingFile: false });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
      this.setState({ isUploadingFile: false });
    }
  };

  render() {
    const { isUploadingFile } = this.state;
    const { buttonIcon, size, ...props } = this.props;

    return (
      <ApolloConsumer>
        {(client) => (
          <Wrapper>
            <PaddedView horizontal={false}>
              <UserAvatarConnected
                size={size}
                buttonIcon={buttonIcon}
                onPressIcon={() => this.handleUploadPhoto({ client })}
                isLoading={isUploadingFile}
                {...props}
              />
            </PaddedView>
          </Wrapper>
        )}
      </ApolloConsumer>
    );
  }
}

export default UserAvatarUpdate;
