import React, { Component } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { Button, styled, H5 } from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';
import PassKit from 'react-native-passkit-wallet';
import gql from 'graphql-tag';
import RNFetchBlob from 'rn-fetch-blob';

import { withApollo } from 'react-apollo';

const iconSource = {
  // circumvent react-native's asset weirdness with linked npm packages
  uri:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAoCAYAAAC1mQk2AAAAAXNSR0IArs4c6QAABU1JREFUaAXdmU1oHVUUx//3zryvJE2apm3Sl49qErUVLBij1dJUu3JlQYQquNCFbgSx4EJEiqD4CdadC0ULLhRERBDdCiIoNn5ANSlNk1Y0bdqkjUneR+bNx/WcO29eMvUlndcmdl4vb3LvnDkzc35z7jln7kSgSlNqOHHqlJORc6ZAaxWFOIhmgY0tLaqQnra7uu5bFEKo5WaJYEcpJU6f/GWv46qjpNEXyOukzwuIV27ZOfAOAbpscwVsbHT4RU/h9ToBqWomwY0S3B0Mp8HGx4d7HAt/svb0InD0pMKJOa/qyXETtqUEHu0VGNzs+0gK+TzBHZFsqFvCQe7ztsILx9wQFE1RxHm7aCm8N+pheMYPMbL1MIeVyUA0I4cAhd8u+XsMQjS0E/S+PHZ/hSAzyVPUfzbuktdMslhtHBkZSZTBsIWNnlkksUdTUHn0c/VY0diHjBkWwQghISRvBoWQ1DOL4guO45TBNDZAyQM7NsziUPYbdFDIGaoUM5qwOQoS86INX/6zH59P7QgdDDymhW3JHD7Y9CTk/MWQUpx32si4Q/JT9Nz8No32VUwNge3O/AyZu6hdWtGok8EB+T4mVgJrxoUKlA41guI+jo1CSTfp5w4YhTGKubKQjoQ8JhQlDIqzieYBTKazKNFhnRzjSEY2STKu1ZnH7XM/IKUWtVMCuBAYp803u57AsdwpoEQvY3XStmx9EC/lxkLW6gIdSMYyG3yoQFAn/bQ1g482DoSsDXlsyn9/rMQZ1+fYt3JYjRb+ApqWrA2B2YIKMwcV/UxlIKHIoTFNHozgEdSiKOmkUYK9cvJgqKfm9mDouAM5Uye1rKERf9+2Fa/2fLdy8tieb8Hd344s+bMeRoU8un49jcNcw7YtGaynoud5ac6I3ReSS/G1pBNpFKTZSMpVlHQIVJFHFXWeOI+z9yg9HU3T9N/u8/lin+M6aC3QTK2hItNrKD8PvVrlGNbbsiIZxSgG4hwV9HyOH+a1ZS6RyyGfz0PSSzFV6wzbgomxPxwFzzCoQEtbr6xZvHqju9OiAcIqQc7Owvzxe5jnJiEJLCogw3i0ubQ59AbuNTVD7N0Ht6sbXjJFFZiuVMODclIpurdArljsL4Md92zb0uPVaVY/2pQvIv3xh7Qq8K4Ix1AMxDPEckn/oYdR7O8nb117Gl4oYGdQoGvz+wp8ucYM8k8/Q0+fysYKOiwOPFUioKJDM+SRx1Do610TKL5+Q0ODq8FoWq5mB+tGbkVTonTwcQ3H00zHDvXcgjF7ir1UdBxgcDeK3Z2Rrx9FMZ1OlwKPRdGPrLOwdQvsPUN6mjEEYzEkbxxLlutqKDfbDef+ByJftxbF0JtHLSdeSXfhrkE0tW6G89UXOgewfpAobI6pwXuB/fvhUjZej6YTxpnx445lWcZ63CAhTSTPTkKdO0crBguqfRu87dthhT/crumtE+lNN62bxwJLbc+B3dEO8FZpaxbSlStePliXGLv8Jtdj/8YG489YN1JraXH9OkZQ117uY/RkbLvg1zHDkPH+MlrjQ2tv3zWn56CURvmrfY1XiKG6mUgoWkJZGkwY4pMY2nhVJqVSGb3012DZbP/LyVS67uOM/kmhaPa9wU/E9xi5Lt2QeZYWaetfOa/KD9FOamps/j3b1XeEtUNrsKmp8XcLC/nnbLsUkke77PXTophSjQ0tJ7M9fTt5/B8wFly6dH5XMTf/tWUtdq7F4nM9cQ3DVKlUOpdIJt/qyPa+tvxeq3pmcvLMnQbkreTXrJRuea2+/PT/e+wpWvHQ50RvhoJpQqnUT9lstlDNin8Bjwadt7VBWwgAAAAASUVORK5CYII=',
};

const AppleWalletButton = styled(
  ({ theme }) => ({
    borderRadius: theme.sizing.baseBorderRadius,
    marginHorizontal: theme.sizing.baseUnit,
    backgroundColor: theme.colors.black,
    borderColor: theme.colors.black,
  }),
  'ui-passes.AddToAppleWalletButton.AppleWalletButton'
)(Button);

const AppleWalletIcon = styled(
  ({ theme }) => ({
    margin: theme.sizing.baseUnit / 2,
    height: 20, // image dimensions
    width: 27,
  }),
  'ui-passes.AddToAppleWalletButton.AppleWalletIcon'
)(Image);

const ButtonRow = styled(
  {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  'ui-passes.AddToAppleWalletButton.ButtonRow'
)(View);

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
            <AppleWalletIcon source={iconSource} />
            <H5>Add to Apple Wallet</H5>
          </ButtonRow>
        )}
      </AppleWalletButton>
    );
  }
}

export default withApollo(AddToAppleWalletButton);
