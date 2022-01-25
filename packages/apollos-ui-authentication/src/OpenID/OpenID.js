import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';

import { PaddedView, Button, H1, H5, ErrorCard } from '@apollosproject/ui-kit';

import { FlexedSafeAreaView, TitleText, PromptText } from '../styles';

const OpenID = ({ providerFriendlyName, onRequestOpenIdConnect, error }) => {
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
          {error && <ErrorCard message={'Something went wrong authenticating you. You can skip, or try again.'}/>}
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
  error: PropTypes.bool.isRequired,
  onRequestOpenIdConnect: PropTypes.func.isRequired,
  providerFriendlyName: PropTypes.string,
};

export default OpenID;
