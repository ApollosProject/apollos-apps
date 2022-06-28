import { UIText } from '../typography';
import styled from '../styled';

const CellTextSmall = styled(
  ({ theme }) => ({
    paddingLeft: theme.sizing.baseUnit / 2,
    paddingRight: theme.sizing.baseUnit / 2,
    fontSize: theme.helpers.rem(0.875),
    color: theme.colors.text.secondary,
    justifyContent: 'center',
  }),
  'ui-kit.TableView.CellTextSmall'
)(UIText);

export default CellTextSmall;
