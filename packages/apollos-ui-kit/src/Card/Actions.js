import PaddedView from '../PaddedView';
import styled from '../styled';

const Actions = styled(
  {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 0,
  },
  'Card.Actions'
)(PaddedView);

export default Actions;
