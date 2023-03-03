import renderer from 'react-test-renderer';
import { GradientOverlayImage } from '@apollosproject/ui-kit';

import Features from './Features';

describe('The Onboarding Features component', () => {
  it('should render', () => {
    const tree = renderer.create(<Features />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom first name', () => {
    const tree = renderer.create(<Features firstName={'firstName'} />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(<Features slideTitle={'Custom title text'} />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <Features description={'Custom description text'} />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a BackgroundComponent', () => {
    const tree = renderer.create(
      <Features
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
    const tree = renderer.create(<Features onPressPrimary={jest.fn()} />);
    expect(tree).toMatchSnapshot();
  });
});
