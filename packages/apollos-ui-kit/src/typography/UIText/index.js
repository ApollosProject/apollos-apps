import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { compose, setDisplayName, pure } from 'recompose';

import styled from '../../styled';
import { withPlaceholder, Typography } from '../../Placeholder';
import withThemeColor from '../withThemeColor';

const UIText = compose(
  setDisplayName('ui-kit.UIText'),
  withThemeColor,
  styled(
    ({ theme, bold, italic }) => ({
      fontSize: theme.helpers.rem(0.875),
      lineHeight: theme.helpers.verticalRhythm(0.875),
      fontFamily: theme.typography.ui.regular,
      fontStyle: italic ? 'italic' : null,
      fontWeight: bold ? '700' : null,
      color: theme.colors.text.primary,
    }),
    'ui-kit.UIText'
  ),
  withPlaceholder(Typography, { width: '40%' }),
  pure
)(Text);

UIText.propTypes = {
  bold: PropTypes.bool,
  italic: PropTypes.bool,
  isLoading: PropTypes.bool, // display loading placeholder
  ...Text.propTypes,
};

export default UIText;
