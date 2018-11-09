import { View } from 'react-native';
import styled from './styled';

export default styled(({ theme, byWidth }) => ({
  width: byWidth ? theme.sizing.baseUnit / 2 : null,
  height: byWidth ? null : theme.sizing.baseUnit / 2,
}))(View);
