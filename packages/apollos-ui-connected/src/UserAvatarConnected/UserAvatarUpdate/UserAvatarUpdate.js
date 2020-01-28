import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { ApolloConsumer } from 'react-apollo';

import { PaddedView, styled } from '@apollosproject/ui-kit';

import UserAvatarConnected from '../UserAvatarConnected';

import uploadPhoto from './uploadPhoto';

const Wrapper = styled({
  justifyContent: 'center',
  alignItems: 'center',
})(View);

export default class UserAvatarUpdate extends PureComponent {
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
      console.warn(e);
      this.setState({ isUploadingFile: false });
    }
  };

  render() {
    const { isUploadingFile } = this.state;

    return (
      <ApolloConsumer>
        {(client) => (
          <Wrapper>
            <PaddedView horizontal={false}>
              <UserAvatarConnected
                size="large"
                buttonIcon="camera"
                onPressIcon={() => this.handleUploadPhoto({ client })}
                isLoading={isUploadingFile}
              />
            </PaddedView>
          </Wrapper>
        )}
      </ApolloConsumer>
    );
  }
}
