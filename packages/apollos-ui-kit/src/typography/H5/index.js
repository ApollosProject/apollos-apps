import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { compose, setDisplayName, pure } from 'recompose';

import styled from '../../styled';
import { withPlaceholder, Typography } from '../../Placeholder';

const H5 = compose(
  setDisplayName('ui-kit.Typography.H5'),
  styled(
    ({ theme, padded }) => ({
      fontSize: theme.helpers.rem(0.875),
      lineHeight: theme.helpers.verticalRhythm(0.875),
      fontFamily: theme.typography.sans.medium.default,
      color: theme.colors.text.primary,
      ...(padded
        ? {
            paddingTop: theme.helpers.verticalRhythm(0.5775),
            paddingBottom: theme.helpers.verticalRhythm(0.4375),
          }
        : {}),
    }),
    'ui-kit.Typography.H5'
  ),
  withPlaceholder(Typography, { width: '60%' }),
  pure
)(Text);

H5.propTypes = {
  padded: PropTypes.bool,
  isLoading: PropTypes.bool, // display loading placeholder
  ...Text.propTypes,
};

export default H5;
