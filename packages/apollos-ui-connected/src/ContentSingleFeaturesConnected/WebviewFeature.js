import React from 'react';
import PropTypes from 'prop-types';
import { SideBySideView, H3, UIText, styled } from '@apollosproject/ui-kit';
import { WebView } from 'react-native-webview';
import { Platform, View, TouchableOpacity, Linking } from 'react-native';
// import { SafeAreaView } from 'react-navigation';

const StyledCard = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.black,
    height: 400,
    borderRadius: theme.sizing.baseBorderRadius,
    marginHorizontal: theme.sizing.baseUnit,
    marginVertical: theme.sizing.baseUnit * 0.75,
    overflow: 'hidden',
    ...Platform.select(theme.shadows.default),
  }),
  'ui-connected.WebviewFeature.StyledCard'
)(View);

const StyledWebView = styled(
  () => ({
    flex: 1,
  }),
  'ui-connected.WebviewFeature.StyledWebView'
)(WebView);

const StyledH3 = styled(
  ({ theme }) => ({
    paddingHorizontal: theme.sizing.baseUnit,
    color: theme.colors.screen,
  }),
  'ui-connected.WebviewFeature.StyledH3'
)(H3);

const StyledText = styled(
  ({ theme }) => ({
    color: theme.colors.screen,
    paddingHorizontal: theme.sizing.baseUnit,
  }),
  'ui-connected.WebviewFeature.StyledText'
)(UIText);

const StyledSideBySideView = styled(
  () => ({
    alignItems: 'center',
  }),
  'ui-connected.WebviewFeature.StyledSideBySideView'
)(SideBySideView);

const WebviewFeature = ({ url, title, linkText }) => (
  <StyledCard>
    {title && (
      <StyledSideBySideView>
        <StyledH3 padded>{title}</StyledH3>
        <TouchableOpacity onPress={() => Linking.openURL(url)}>
          <StyledText>{linkText}</StyledText>
        </TouchableOpacity>
      </StyledSideBySideView>
    )}
    <StyledWebView source={{ uri: url }} />
  </StyledCard>
);

WebviewFeature.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
  linkText: PropTypes.string,
};

export default WebviewFeature;
