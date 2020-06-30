import { View } from 'react-native';

import styled from '../styled';

const AvatarList = styled(
  {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  'ui-kit.Avatar.AvatarList'
)(View);

export default AvatarList;
