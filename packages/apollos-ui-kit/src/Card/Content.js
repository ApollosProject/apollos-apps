import PaddedView from '../PaddedView';
import styled from '../styled';

const Content = styled(
  ({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit,
  }),
  'Card.Content'
)(PaddedView);

export default Content;
