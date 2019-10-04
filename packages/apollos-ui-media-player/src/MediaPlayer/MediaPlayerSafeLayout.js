import React from 'react';
import { View } from 'react-native';
import { styled } from '@apollosproject/ui-kit';

const InnerView = styled(
  ({ isFullscreen = false, theme, safeAreaInsets }) =>
    console.warn(String(safeAreaInsets.bottom)) || {
      marginBottom: isFullscreen
        ? 0
        : Math.max(theme.sizing.baseUnit, safeAreaInsets.bottom * 0.75),
    }
)(View);

const MediaPlayerSafeLayout = (props) => (
  <LayoutConsumer>
    {(insets) => (
      <InnerView safeAreaInsets={insets} {...props} />
    )}
  </LayoutConsumer>
);

export default MediaPlayerSafeLayout;
