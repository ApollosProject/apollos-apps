import renderer from 'react-test-renderer';
import { GradientOverlayImage } from '@apollosproject/ui-kit';

import Follow from './Follow';

describe('The Onboarding Follow component', () => {
  it('should render', () => {
    const tree = renderer.create(<Follow />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom first name', () => {
    const tree = renderer.create(<Follow firstName={'firstName'} />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(<Follow slideTitle={'Custom title text'} />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <Follow description={'Custom description text'} />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a BackgroundComponent', () => {
    const tree = renderer.create(
      <Follow
        BackgroundComponent={
          <GradientOverlayImage
            source={'https://picsum.photos/375/812/?random'}
          />
        }
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide', () => {
    const tree = renderer.create(<Follow onPressPrimary={jest.fn()} />);
    expect(tree).toMatchSnapshot();
  });
});
