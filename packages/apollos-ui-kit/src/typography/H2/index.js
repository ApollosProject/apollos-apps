import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { compose, setDisplayName, pure } from 'recompose';

import styled from '../../styled';
import { withPlaceholder, Typography } from '../../Placeholder';

const styles = styled(
  ({ theme, padded }) => ({
    fontSize: theme.helpers.rem(2.25),
    lineHeight: theme.helpers.verticalRhythm(2.25, 1.15),
    fontFamily: theme.typography.sans.black.default,
    color: theme.colors.text.primary,
    ...(padded
      ? {
          paddingTop: theme.sizing.baseUnit * 1.5,
          paddingBottom: theme.sizing.baseUnit * 1.25,
        }
      : {}),
  }),
  'H2'
);

const H2 = compose(
  setDisplayName('H2'),
  styles,
  withPlaceholder(Typography, { width: '100%' }),
  pure
)(Text);

H2.propTypes = {
  padded: PropTypes.bool,
  isLoading: PropTypes.bool, // display loading placeholder
  ...Text.propTypes,
};

export default H2;
