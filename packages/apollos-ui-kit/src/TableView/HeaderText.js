import { H4 } from '../typography';
import styled from '../styled';

const HeaderText = styled(
  ({ theme }) => ({
    color: theme.colors.text.secondary,
    paddingLeft: theme.sizing.baseUnit + theme.sizing.baseBorderRadius * 0.5,
    paddingRight: theme.sizing.baseUnit,
    paddingBottom: theme.sizing.baseUnit * 0.5,
  }),
  'ui-kit.TableView.HeaderText'
)(H4);

export default HeaderText;
