import { SafeAreaView } from 'react-native';
import { styled } from '@apollosproject/ui-kit';

const Header = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
  paddingBottom: theme.sizing.baseUnit * 1.5,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: theme.colors.background.paper,
}))(SafeAreaView);

export default Header;
