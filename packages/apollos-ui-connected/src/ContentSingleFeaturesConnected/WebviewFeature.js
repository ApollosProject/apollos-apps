import React from 'react';
import PropTypes from 'prop-types';
import { ModalView, styled } from '@apollosproject/ui-kit';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-navigation';

const FlexedSafeAreaView = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.black,
}))(SafeAreaView);

const WebviewFeature = ({ url, modal, navigation }) => {
  if (modal) {
    return (
      <ModalView navigation={navigation} onClose={() => navigation.pop()}>
        <FlexedSafeAreaView>
          <WebView source={{ uri: url }} />
        </FlexedSafeAreaView>
      </ModalView>
    );
  }
  return <WebView source={{ uri: url }} />;
};

WebviewFeature.propTypes = {
  url: PropTypes.string.isRequired,
  modal: PropTypes.bool.isRequired,
};

export default WebviewFeature;
