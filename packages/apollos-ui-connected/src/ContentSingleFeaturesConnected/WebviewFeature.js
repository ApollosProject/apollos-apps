import React from 'react';
import PropTypes from 'prop-types';
import { SideBySideView, H3, UIText, styled } from '@apollosproject/ui-kit';
import { WebView } from 'react-native-webview';
import { Platform, View, TouchableOpacity, Linking } from 'react-native';
// import { SafeAreaView } from 'react-navigation';

const StyledCard = styled(
  ({ theme, height }) => ({
    backgroundColor: theme.colors.black,
    height,
    borderRadius: theme.sizing.baseBorderRadius,
    marginHorizontal: theme.sizing.baseUnit,
    marginVertical: theme.sizing.baseUnit * 0.75,
    overflow: 'hidden',
    ...Platform.select(theme.shadows.default),
  }),
  'ui-connected.ContentSingleFeaturesConnected.WebviewFeature.StyledCard'
)(View);

const StyledWebView = styled(
  () => ({
    flex: 1,
  }),
  'ui-connected.ContentSingleFeaturesConnected.WebviewFeature.StyledWebView'
)(WebView);

const StyledH3 = styled(
  ({ theme }) => ({
    paddingHorizontal: theme.sizing.baseUnit,
    color: theme.colors.screen,
  }),
  'ui-connected.ContentSingleFeaturesConnected.WebviewFeature.StyledH3'
)(H3);

const StyledText = styled(
  ({ theme }) => ({
    color: theme.colors.secondary,
    paddingHorizontal: theme.sizing.baseUnit,
  }),
  'ui-connected.ContentSingleFeaturesConnected.WebviewFeature.StyledText'
)(UIText);

const StyledSideBySideView = styled(
  () => ({
    alignItems: 'center',
  }),
  'ui-connected.ContentSingleFeaturesConnected.WebviewFeature.StyledSideBySideView'
)(SideBySideView);

const WebviewFeature = ({ url, title, linkText, height }) => (
  <StyledCard height={height}>
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

WebviewFeature.defaultProps = {
  height: 400,
};

WebviewFeature.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
  linkText: PropTypes.string,
  height: PropTypes.number,
};

export default WebviewFeature;
