import PropTypes from 'prop-types';
import { View } from 'react-native';

import styled from '../styled';

const Item = styled(({ top, left, bottom, right, centered, theme }) => ({
  position: 'absolute',
  ...(centered
    ? {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        top: top ? theme.sizing.baseUnit / 2 : undefined,
        right: right ? theme.sizing.baseUnit / 2 : undefined,
        bottom: bottom ? theme.sizing.baseUnit / 2 : undefined,
        left: left ? theme.sizing.baseUnit / 2 : undefined,
      }),
}))(View);

Item.propTypes = {
  top: PropTypes.bool,
  left: PropTypes.bool,
  right: PropTypes.bool,
  bottom: PropTypes.bool,
  centered: PropTypes.bool,
};

export default Item;
