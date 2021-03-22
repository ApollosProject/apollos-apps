import {
  SafeAreaConsumer,
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';

import styled from '../styled';

const FlexedSafeAreaView = styled({ flex: 1 })(SafeAreaView);

export {
  SafeAreaProvider as LayoutProvider,
  SafeAreaConsumer as LayoutConsumer,
  useSafeAreaInsets,
  SafeAreaView,
  FlexedSafeAreaView,
};
