import { TouchableOpacity, Text } from 'react-native';
import renderer from 'react-test-renderer';
import OnboardingSwiper from './index';

describe('The onboarding swiper', () => {
  it('should render with a fragment as a child', () => {
    const tree = renderer.create(
      <OnboardingSwiper>
        {({ swipeForward, scrollBy }) => (
          <>
            <TouchableOpacity onPress={swipeForward}>
              <Text>1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={swipeForward}>
              <Text>2</Text>
            </TouchableOpacity>
            <TouchableOpacity key="3" onPress={() => scrollBy(-1)}>
              <Text>3</Text>
            </TouchableOpacity>
          </>
        )}
      </OnboardingSwiper>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with an array as a child', () => {
    const tree = renderer.create(
      <OnboardingSwiper>
        {({ swipeForward, scrollBy }) => [
          <TouchableOpacity key="1" onPress={swipeForward}>
            <Text>1</Text>
          </TouchableOpacity>,
          <TouchableOpacity key="2" onPress={swipeForward}>
            <Text>2</Text>
          </TouchableOpacity>,
          <TouchableOpacity key="3" onPress={() => scrollBy(-1)}>
            <Text>3</Text>
          </TouchableOpacity>,
        ]}
      </OnboardingSwiper>
    );

    expect(tree).toMatchSnapshot();
  });
});
