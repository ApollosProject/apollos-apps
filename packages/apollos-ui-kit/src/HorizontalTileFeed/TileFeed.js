import { FlatList } from 'react-native-gesture-handler';

import { withTheme } from '../theme';

// We use FlatList from RNGestureHandler so that we can properly enable horizontal scrolling within a TabView on Android.
const TileFeed = withTheme(({ theme }) => ({
  contentContainerStyle: {
    // The horizontal padding keeps cards on grid (the other half of the baseUnit lives on the
    // card). The vertical padding is purly stylistic.
    padding: theme.sizing.baseUnit / 2,
    paddingBottom: 0,
  },
}))(FlatList);

export default TileFeed;
