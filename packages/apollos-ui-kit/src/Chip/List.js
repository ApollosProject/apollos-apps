import { View } from 'react-native';

import styled from '../styled';

const ChipList = styled(
  {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  'ui-kit.Chip.ChipList'
)(View);

export default ChipList;
