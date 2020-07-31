import PaddedView from '../PaddedView';
import styled from '../styled';

const Content = styled(
  ({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit,
  }),
  'ui-kit.Card.Content.Content'
)(PaddedView);

export default Content;
