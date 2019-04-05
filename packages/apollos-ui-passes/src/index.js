import React, { Component } from 'react';
import { Platform, SafeAreaView } from 'react-native';
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
                  {Platform.OS === 'ios' ? (
                    <AddToAppleWalletButton
                      url={(data.userPass || {}).passkitFileUrl}
                    />
                  ) : null}
                </React.Fragment>
              )
            }
          </Query>
        </CenteredSafeAreaView>
      </ModalView>
    );
  }
}

export { PassView };
export default Passes;