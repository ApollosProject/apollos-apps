import { View } from 'react-native';
import styled from '../styled';

const CellContent = styled(
  ({ theme }) => ({
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: theme.sizing.baseUnit / 2,
    paddingRight: theme.sizing.baseUnit / 2,
  }),
  'ui-kit.TableView.CellContent'
)(View);

export default CellContent;
