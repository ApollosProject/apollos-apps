import React from 'react';
import PropTypes from 'prop-types';
import { H3, styled, PaddedView } from '@apollosproject/ui-kit';
import { WebView } from 'react-native-webview';
import { Platform, View } from 'react-native';
// import { SafeAreaView } from 'react-navigation';

const FlexedActionCard = styled(({ theme, inHorizontalList = false }) => ({
  backgroundColor: theme.colors.black,
  height: 400,
  borderRadius: theme.sizing.baseBorderRadius,
  marginHorizontal: theme.sizing.baseUnit,
  marginVertical: theme.sizing.baseUnit * 0.75,
  overflow: 'hidden',
  ...(inHorizontalList
    ? {
        // provides spacing between cards also fixes android shadow needing "space" to render into
        margin: theme.sizing.baseUnit / 2,
        marginBottom: theme.sizing.baseUnit * 0.75,
      }
    : {
        marginHorizontal: theme.sizing.baseUnit,
        marginVertical: theme.sizing.baseUnit * 0.75,
      }),
  ...Platform.select(theme.shadows.default),
}))(View);

const FlexedWebView = styled(() => ({
  flex: 1,
}))(WebView);

const StyledH3 = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  color: theme.colors.screen,
}))(H3);

const WebviewFeature = ({ url }) => (
  <FlexedActionCard>
    <StyledH3 padded>{'Setlist'}</StyledH3>
    <FlexedWebView source={{ uri: url }} />
  </FlexedActionCard>
);

WebviewFeature.propTypes = {
  url: PropTypes.string.isRequired,
};

export default WebviewFeature;
