import { View } from 'react-native';
import renderer from 'react-test-renderer';

import { Intro, Scripture, Prayer, Community } from './slides';

test('should render the slides', () => {
  const tree = renderer.create(
    <View>
      <Intro />
      <Scripture />
      <Prayer />
      <Community />
    </View>
  );

  expect(tree).toMatchSnapshot();
});
