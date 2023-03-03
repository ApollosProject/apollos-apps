import { H6 } from '../typography';
import styled from '../styled';

const FooterText = styled(
  ({ theme }) => ({
    color: theme.colors.text.secondary,
    paddingLeft: theme.sizing.baseUnit + theme.sizing.baseBorderRadius * 0.5,
    paddingRight: theme.sizing.baseUnit,
    paddingVertical: theme.sizing.baseUnit * 0.5,
  }),
  'ui-kit.TableView.FooterText'
)(H6);

export default FooterText;
