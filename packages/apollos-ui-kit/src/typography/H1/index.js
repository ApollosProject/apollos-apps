import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { compose, setDisplayName, pure } from 'recompose';

import styled from '../../styled';
import { withPlaceholder, Typography } from '../../Placeholder';
import withThemeColor from '../withThemeColor';

const H1 = compose(
  setDisplayName('ui-kit.Typography.H1'),
  withThemeColor,
  styled(
    ({ theme, padded }) => ({
      fontSize: theme.helpers.rem(2.6875),
      lineHeight: theme.helpers.verticalRhythm(2.6875, 1.15),
      fontFamily: theme.typography.sans.black.default,
      color: theme.colors.text.primary,
      ...(padded
        ? {
            paddingVertical: theme.helpers.verticalRhythm(2.015625),
          }
        : {}),
    }),
    'ui-kit.Typography.H1'
  ),
  withPlaceholder(Typography, { width: '100%' }),
  pure
)(Text);

H1.propTypes = {
  padded: PropTypes.bool,
  isLoading: PropTypes.bool, // display loading placeholder
  ...Text.propTypes,
};

export default H1;
