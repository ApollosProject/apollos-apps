import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from '@apollosproject/ui-kit';

const Header = styled(
  ({ theme }) => ({
    padding: theme.sizing.baseUnit,
    paddingBottom: theme.sizing.baseUnit * 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.paper,
  }),
  'ui-auth.Header'
)(SafeAreaView);

export default Header;
