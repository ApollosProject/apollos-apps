import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { compose, setDisplayName, pure } from 'recompose';

import styled from '../../styled';
import { withPlaceholder, Typography } from '../../Placeholder';
import withThemeColor from '../withThemeColor';

const H4 = compose(
  setDisplayName('ui-kit.Typography.H4'),
  withThemeColor,
  styled(
    ({ theme, padded }) => ({
      fontSize: theme.helpers.rem(1),
      lineHeight: theme.helpers.verticalRhythm(1),
      fontFamily: theme.typography.sans.bold.default,
      color: theme.colors.text.primary,
      ...(padded
        ? {
            paddingTop: theme.helpers.verticalRhythm(0.66),
            paddingBottom: theme.helpers.verticalRhythm(0.5),
          }
        : {}),
    }),
    'ui-kit.Typography.H4'
  ),
  withPlaceholder(Typography, { width: '80%' }),
  pure
)(Text);

H4.propTypes = {
  isLoading: PropTypes.bool, // display loading placeholder
  ...Text.propTypes,
};

export default H4;
