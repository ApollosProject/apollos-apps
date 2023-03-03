import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

import {
  AppIcon,
  PaddedView,
  BackgroundView,
  Button,
  H4,
  H3,
  Card,
  styled,
  BodyText,
} from '@apollosproject/ui-kit';

import { SafeAreaView } from 'react-native-safe-area-context';

const FlexedSafeAreaView = styled({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
})(SafeAreaView);

const LandingCardContainer = styled({
  alignItems: 'center',
})(PaddedView);

const ButtonContainer = styled(
  ({
    theme: {
      sizing: { baseUnit },
    },
  }) => ({
    width: '100%',
    marginTop: baseUnit,
  })
)(View);

const HeadingContainer = styled(
  ({
    theme: {
      sizing: { baseUnit },
    },
  }) => ({
    marginVertical: baseUnit,
    alignItems: 'center',
  })
)(View);

const ErrorText = styled(({ theme }) => ({
  color: theme.colors.alert,
  paddingTop: theme.sizing.baseUnit / 2,
}))(BodyText);

const BottomCard = styled(
  ({
    theme: {
      sizing: { baseUnit },
    },
  }) => ({
    marginBottom: baseUnit,
    paddingTop: baseUnit,
  })
)(Card);

const BottomAppIcon = styled(({ theme }) => ({
  position: 'absolute',
  top: 0,
  alignSelf: 'center',
  marginTop: -18,
  ...Platform.select(theme.shadows.high),
}))(AppIcon);

const Overlay = styled(({ theme }) => ({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: theme.colors.background.regular,
}))(View);

const AuthLanding = ({
  providerFriendlyName,
  onRegisterWithOpenId,
  demoUrl,
  error,
}) => {
  return (
    <BackgroundView avoidHeader>
      <WebView
        source={{ uri: demoUrl }}
        style={StyleSheet.absoluteFill}
        automaticallyAdjustContentInsets
        contentInsetAdjustmentBehavior="automatic"
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction
      />
      <Overlay />
      <FlexedSafeAreaView edges={['right', 'left', 'bottom']}>
        <BottomCard>
          <LandingCardContainer>
            <HeadingContainer>
              <H4 secondary>{'Do you have a'}</H4>
              <H3>{providerFriendlyName}</H3>
              <H4 secondary>{'account?'}</H4>
            </HeadingContainer>
            <BodyText secondary>
              {
                'If you’ve logged in online before, we’ll sync your history with the app. If not, you can create one on the next screen.'
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
              <Button onPress={onRegisterWithOpenId} title="Let’s go" />
            </ButtonContainer>
          </LandingCardContainer>
        </BottomCard>

        <BottomAppIcon size={66} />
      </FlexedSafeAreaView>
    </BackgroundView>
  );
};

AuthLanding.propTypes = {
  error: PropTypes.bool.isRequired,
  onRegisterWithOpenId: PropTypes.func.isRequired,
  providerFriendlyName: PropTypes.string,
  demoUrl: PropTypes.string,
};

export default AuthLanding;
