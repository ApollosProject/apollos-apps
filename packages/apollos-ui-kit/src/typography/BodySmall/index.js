import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { compose, pure, setDisplayName } from 'recompose';

import styled from '../../styled';
import { withPlaceholder, Typography } from '../../Placeholder';

const styles = styled(({ theme, bold, italic }) => {
  let fontStack = theme.typography.sans.regular.default;

  if (bold && italic) {
    fontStack = theme.typography.sans.bold.italic;
  } else if (bold) {
    fontStack = theme.typography.sans.bold.default;
  } else if (italic) {
    fontStack = theme.typography.sans.regular.italic;
  }

  return {
    fontSize: theme.helpers.rem(0.875),
    lineHeight: theme.helpers.verticalRhythm(1, 1.25),
    fontFamily: fontStack,
    color: theme.colors.text.primary,
  };
}, 'BodySmall');

const BodySmall = compose(
  setDisplayName('BodySmall'),
  styles,
  withPlaceholder(Typography),
  pure
)(Text);

BodySmall.propTypes = {
  bold: PropTypes.bool,
  italic: PropTypes.bool,
  isLoading: PropTypes.bool, // display loading placeholder
  ...Text.propTypes,
};

BodySmall.defaultProps = {
  bold: false,
  italic: false,
};

export default BodySmall;
