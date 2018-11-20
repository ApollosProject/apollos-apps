import { FlatList } from 'react-native';

import { withTheme } from '../theme';

const TileFeed = withTheme(({ theme }) => ({
  contentContainerStyle: {
    // The horizontal padding keeps cards on grid (the other half of the baseUnit lives on the
    // card). The vertical padding is purly stylistic.
    padding: theme.sizing.baseUnit / 2,
    paddingBottom: 0,
  },
}))(FlatList);

export default TileFeed;
