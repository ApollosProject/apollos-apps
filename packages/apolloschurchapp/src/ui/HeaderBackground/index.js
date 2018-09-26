import { View } from 'react-native';
import styled from 'apolloschurchapp/src/ui/styled';

const HeaderBackground = styled(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: theme.colors.paper,
}))(View);

export default HeaderBackground;
