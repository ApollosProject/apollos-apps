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
  'ui-kit.Card.Actions.Actions'
)(PaddedView);

export default Actions;
