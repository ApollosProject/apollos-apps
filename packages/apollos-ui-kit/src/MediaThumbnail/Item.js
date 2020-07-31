import PropTypes from 'prop-types';
import { View } from 'react-native';

import styled from '../styled';

const Item = styled(
  ({ top, left, bottom, right, centered, theme }) => ({
    position: 'absolute',
    top: top ? theme.sizing.baseUnit / 2 : undefined,
    right: right ? theme.sizing.baseUnit / 2 : undefined,
    bottom: bottom ? theme.sizing.baseUnit / 2 : undefined,
    left: left ? theme.sizing.baseUnit / 2 : undefined,
    ...(centered
      ? {
          top: !bottom ? 0 : undefined,
          left: !right ? 0 : undefined,
          right: !left ? 0 : undefined,
          bottom: !top ? 0 : undefined,
          alignItems: 'center',
          justifyContent: 'center',
        }
      : {}),
  }),
  'ui-kit.MediaThumbnail.Item'
)(View);

Item.propTypes = {
  top: PropTypes.bool,
  left: PropTypes.bool,
  right: PropTypes.bool,
  bottom: PropTypes.bool,
  centered: PropTypes.bool,
};

export default Item;
