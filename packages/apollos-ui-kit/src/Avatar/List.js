import { View } from 'react-native';

import styled from '../styled';

const AvatarList = styled(
  {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  'ui-kit.Avatar.List.AvatarList'
)(View);

export default AvatarList;
