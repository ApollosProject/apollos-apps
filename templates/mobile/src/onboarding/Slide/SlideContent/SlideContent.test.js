import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import SlideContent from './index';

describe('The Onboarding Slide component', () => {
  it('should render an icon', () => {
    const tree = renderer.create(<SlideContent icon />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom icon', () => {
    const tree = renderer.create(<SlideContent icon={'umbrella'} />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a title', () => {
    const tree = renderer.create(
      <SlideContent title={'Whoa, this is heavy'} />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a description', () => {
    const tree = renderer.create(
      <SlideContent
        description={
          'There\'s that word again: "heavy." Why are things so heavy in the future? Is there a problem with the Earth\'s gravitational pull?'
        }
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with children', () => {
    const tree = renderer.create(
      <SlideContent
        title={'Whoa, this is heavy'}
        description={
          'There\'s that word again: "heavy." Why are things so heavy in the future? Is there a problem with the Earth\'s gravitational pull?'
        }
      >
        <Text>Great Scott!</Text>
      </SlideContent>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render children alone', () => {
    const tree = renderer.create(
      <SlideContent>
        <Text>Great Scott!</Text>
      </SlideContent>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <SlideContent
        title={'Whoa, this is heavy'}
        description={
          'There\'s that word again: "heavy." Why are things so heavy in the future? Is there a problem with the Earth\'s gravitational pull?'
        }
        icon
        isLoading
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render accept additionall props', () => {
    const centeredContent = { flex: 1, justifyContent: 'center' };
    const tree = renderer.create(
      <SlideContent style={centeredContent}>
        <Text>Great Scott!</Text>
      </SlideContent>
    );
    expect(tree).toMatchSnapshot();
  });
});
