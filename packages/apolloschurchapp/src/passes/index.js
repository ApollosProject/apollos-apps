import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { ErrorCard, ModalView, styled } from '@apollosproject/ui-kit';
import { Query } from 'react-apollo';

import PassView from './PassView';
import getPass from './getPass';
import AddToAppleWalletButton from './AddToAppleWalletButton';

const CenteredSafeAreaView = styled({
  flex: 1,
  justifyContent: 'center',
})(SafeAreaView);

class Passes extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <ModalView {...this.props}>
        <CenteredSafeAreaView>
          <Query query={getPass}>
            {({ loading, data, error }) =>
              error ? (
                <ErrorCard error={error} />
              ) : (
                <React.Fragment>
                  <PassView isLoading={loading} {...data.userPass || {}} />
                  <AddToAppleWalletButton
                    url={(data.userPass || {}).passkitFileUrl}
                  />
                </React.Fragment>
              )
            }
          </Query>
        </CenteredSafeAreaView>
      </ModalView>
    );
  }
}
export default Passes;
