import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Color from 'color';

import { withTheme, BackgroundView, H1 } from '@apollosproject/ui-kit';

const ThemedBackgroundView = withTheme(({ theme, colors }) => ({
  colors: colors || [
    theme.colors.primary,
    Color(theme.colors.primary).darken(0.2),
  ],
}))(BackgroundView);

const PermissionsPrompt = memo(({ backgroundColors }) => (
  <ThemedBackgroundView colors={backgroundColors}>
    <H1>Boom</H1>
  </ThemedBackgroundView>
));

PermissionsPrompt.propTypes = {
  backgroundColors: PropTypes.arrayOf(PropTypes.string),
};

export default PermissionsPrompt;
