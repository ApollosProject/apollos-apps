import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import WebView from 'react-native-webview';

import {
  PaddedView,
  Button,
  H4,
  H3,
  Card,
  styled,
  BodyText,
} from '@apollosproject/ui-kit';
import { FlexedSafeAreaView } from '../styles';

const LandingCardContainer = styled(({ theme: { sizing: { baseUnit } } }) => ({
  alignItems: 'center',
  marginBottom: baseUnit,
}))(PaddedView);

const ButtonContainer = styled(({ theme: { sizing: { baseUnit } } }) => ({
  width: '100%',
  marginTop: baseUnit,
}))(View);

const PrimaryButton = styled(({ theme: { sizing: { baseUnit } } }) => ({
  marginBottom: baseUnit / 2,
}))(Button);

const HeadingContainer = styled(({ theme: { sizing: { baseUnit } } }) => ({
  marginVertical: baseUnit,
  alignItems: 'center',
}))(View);

const ErrorText = styled(({ theme }) => ({
  color: theme.colors.alert,
  paddingTop: theme.sizing.baseUnit / 2,
}))(BodyText);

const BottomCard = styled(({ theme: { sizing: { baseUnit } } }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  marginBottom: baseUnit * 2,
}))(Card);

const Overlay = styled(({ theme }) => ({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: theme.colors.background.regular,
}))(View);

const OpenID = ({
  providerFriendlyName,
  onRequestOpenIdConnect,
  demoUrl,
  error,
}) => {
  return (
    <>
      <WebView
        source={{ uri: demoUrl }}
        style={StyleSheet.absoluteFill}
        automaticallyAdjustContentInsets
        contentInsetAdjustmentBehavior="automatic"
      />
      <Overlay />
      <FlexedSafeAreaView
        style={StyleSheet.absoluteFill}
        edges={['right', 'top', 'left', 'bottom']}
      >
        <BottomCard>
          <LandingCardContainer>
            <HeadingContainer>
              <H4 secondary>{'Do you have a'}</H4>
              <H3>{providerFriendlyName}</H3>
              <H4 secondary>{'account?'}</H4>
            </HeadingContainer>
            <BodyText secondary>
              {
                'To finish setting up your profile, we need to connect your profile to your online account.'
              }
            </BodyText>
            {error && (
              <ErrorText>
                {
                  'Something went wrong authenticating you. You can skip, or try again.'
                }
              </ErrorText>
            )}
            <ButtonContainer>
              <PrimaryButton
                onPress={onRequestOpenIdConnect}
                title="Get connected"
              />
            </ButtonContainer>
          </LandingCardContainer>
        </BottomCard>
      </FlexedSafeAreaView>
    </>
  );
};

OpenID.propTypes = {
  values: PropTypes.shape({
    code: PropTypes.string,
  }),
  error: PropTypes.bool.isRequired,
  onRequestOpenIdConnect: PropTypes.func.isRequired,
  providerFriendlyName: PropTypes.string,
  demoUrl: PropTypes.string,
};

export default OpenID;
