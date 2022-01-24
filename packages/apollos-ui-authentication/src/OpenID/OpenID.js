import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';

import { PaddedView, Button, H1, H5 } from '@apollosproject/ui-kit';

import { FlexedSafeAreaView, TitleText, PromptText } from '../styles';

const OpenID = ({ providerFriendlyName, onRequestOpenIdConnect }) => {
  return (
    <FlexedSafeAreaView
      style={StyleSheet.absoluteFill}
      edges={['right', 'top', 'left', 'bottom']}
    >
      <ScrollView contentInsetAdjustmentBehavior={'automatic'}>
        <PaddedView vertical>
          <H1>🎉</H1>
          <TitleText>{'Welcome!'}</TitleText>
          <PromptText>
            {`To complete your profile and access all features, please connect with your ${
              providerFriendlyName || 'online'
            } account.`}
          </PromptText>
        </PaddedView>
      </ScrollView>
      <PaddedView>
        <Button onPress={onRequestOpenIdConnect}>
          <H5>{"Let's Go"}</H5>
        </Button>
      </PaddedView>
    </FlexedSafeAreaView>
  );
};

OpenID.propTypes = {
  values: PropTypes.shape({
    code: PropTypes.string,
  }),
  onRequestOpenIdConnect: PropTypes.func.isRequired,
  providerFriendlyName: PropTypes.string,
};

export default OpenID;
