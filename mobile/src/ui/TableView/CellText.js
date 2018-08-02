import { H5 } from '/mobile/ui/typography';
import styled from '/mobile/ui/styled';

const CellText = styled(({ theme }) => ({
  flexGrow: 1,
  flexShrink: 1,
  paddingLeft: theme.sizing.baseUnit / 2,
  paddingRight: theme.sizing.baseUnit / 2,
}))(H5);

export default CellText;
