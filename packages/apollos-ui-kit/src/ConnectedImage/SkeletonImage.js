import { View } from 'react-native';
import Placeholder from 'rn-placeholder';

import styled from '../styled';

const SkeletonImage = styled(({ theme, forceRatio }) => ({
  aspectRatio: forceRatio || 1,
  backgroundColor: theme.colors.background.inactive,
}))(View);

export default Placeholder.connect(SkeletonImage);
