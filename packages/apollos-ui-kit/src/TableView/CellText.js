import { UIText } from '../typography';
import styled from '../styled';

const CellText = styled(
  ({ theme }) => ({
    paddingLeft: theme.sizing.baseUnit / 2,
    paddingRight: theme.sizing.baseUnit / 2,
    fontSize: theme.helpers.rem(1.0625),
  }),
  'ui-kit.TableView.CellText'
)(UIText);

export default CellText;
