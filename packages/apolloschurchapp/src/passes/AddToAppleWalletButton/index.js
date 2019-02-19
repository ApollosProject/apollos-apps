import React, { Component } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { Button, styled, H5 } from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';
import PassKit from 'react-native-passkit-wallet';
import gql from 'graphql-tag';
import RNFetchBlob from 'rn-fetch-blob';

import { withApollo } from 'react-apollo';

const AppleWalletButton = styled(({ theme }) => ({
  borderRadius: theme.sizing.baseUnit,
  marginHorizontal: theme.sizing.baseUnit,
  backgroundColor: theme.colors.black,
  borderColor: theme.colors.black,
}))(Button);

const AppleWalletIcon = styled(({ theme }) => ({
  margin: theme.sizing.baseUnit / 2,
  height: 20, // image dimensions
  width: 27,
}))(Image);

const ButtonRow = styled({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
})(View);

// export const convertResponseToBase64 = async (response) => {
//   console.log({ response });
//   // const blob = await response.blob();
//   const raw = await response.text();
//   console.log({ raw });
//   // return new Promise((resolve, reject) => {
//   //   const reader = new FileReader();
//   //   reader.onerror = reject;
//   //   reader.onload = () => {
//   //     resolve(reader.result);
//   //   };
//   //   reader.readAsDataURL(blob);
//   // });
// };

class AddToAppleWalletButton extends Component {
  static propTypes = {
    url: PropTypes.string,
    client: PropTypes.shape({
      query: PropTypes.func,
    }).isRequired,
  };

  constructor(...args) {
    super(...args);
    PassKit.canAddPasses().then((canAddPasses) => {
      this.setState({ canAddPasses });
    });
  }

  state = {
    canAddPasses: false,
    isLoadingPass: false,
  };

  handlePress = async () => {
    this.setState({ isLoadingPass: true });

    const {
      data: { authToken },
    } = await this.props.client.query({
      query: gql`
        query {
          authToken @client
        }
      `,
    });

    const passData = await RNFetchBlob.config({
      fileCache: true,
    }).fetch('GET', this.props.url, {
      Authorization: authToken,
    });

    const base64 = await passData.base64();
    await PassKit.addPass(base64);

    this.setState({ isLoadingPass: false });
  };

  render() {
    if (!this.state.canAddPasses || !this.props.url) return null;
    return (
      <AppleWalletButton
        onPress={this.handlePress}
        disabled={this.state.isLoadingPass}
      >
        {this.state.isLoadingPass ? (
          <ActivityIndicator color="white" />
        ) : (
          <ButtonRow>
            <AppleWalletIcon source={require('./appleWalletIcon.png')} />
            <H5>Add to Apple Wallet</H5>
          </ButtonRow>
        )}
      </AppleWalletButton>
    );
  }
}

export default withApollo(AddToAppleWalletButton);
