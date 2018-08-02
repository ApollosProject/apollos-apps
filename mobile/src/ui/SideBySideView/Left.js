import { View } from 'react-native';
import { compose } from 'recompose';

import { enhancer as mediaQuery } from '/mobile/ui/MediaQuery';
import styled from '/mobile/ui/styled';

export default compose(
  mediaQuery(
    ({ md }) => ({ minWidth: md }),
    styled({
      width: `${100 - 41.6666666}%`,
      height: '100%',
      overflow: 'hidden',
    })
  )
)(View);
