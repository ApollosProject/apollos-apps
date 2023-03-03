import { View } from 'react-native';

import styled from '../styled';

const PaddedView = styled(
  ({ theme, horizontal = true, vertical = true, children }) => ({
    paddingHorizontal: horizontal ? theme.sizing.baseUnit : 0,
    paddingVertical: vertical ? theme.sizing.baseUnit : 0,
    ...(!children && vertical
      ? { paddingVertical: theme.sizing.baseUnit / 2 }
      : {}),
  }),
  'ui-kit.PaddedView'
)(View);

export default PaddedView;
