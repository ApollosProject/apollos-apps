import React, { Component } from 'react';
import { Platform, SafeAreaView } from 'react-native';
import { ErrorCard, ModalView, styled } from '@apollosproject/ui-kit';
import { Query } from 'react-apollo';

import PassView from './PassView';
import GET_PASS from './getPass';
import AddToAppleWalletButton from './AddToAppleWalletButton';

const CenteredSafeAreaView = styled(
  {
    flex: 1,
    justifyContent: 'center',
  },
  'ui-passes.CenteredSafeAreaView'
)(SafeAreaView);

class Passes extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <ModalView {...this.props} onClose={() => this.props.navigation.goBack()}>
        <CenteredSafeAreaView>
          <Query query={GET_PASS}>
            {({ loading, data, error }) =>
              error ? (
                <ErrorCard error={error} />
              ) : (
                <>
                  <PassView isLoading={loading} {...data.userPass || {}} />
                  {Platform.OS === 'ios' ? (
                    <AddToAppleWalletButton
                      url={(data.userPass || {}).passkitFileUrl}
                    />
                  ) : null}
                </>
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
