import renderer from 'react-test-renderer';
import { GradientOverlayImage } from '@apollosproject/ui-kit';

import AskNotifications from './AskNotifications';

describe('The Onboarding AskNotifications component', () => {
  it('should render', () => {
    const tree = renderer.create(<AskNotifications />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a BackgroundComponent', () => {
    const tree = renderer.create(
      <AskNotifications
        BackgroundComponent={
          <GradientOverlayImage
            source={'https://picsum.photos/640/640/?random'}
          />
        }
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <AskNotifications slideTitle={'Custom title text'} />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <AskNotifications description={'Custom description text'} />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a button', () => {
    const tree = renderer.create(
      <AskNotifications onPressButton={jest.fn()} />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render the button disabled', () => {
    const tree = renderer.create(
      <AskNotifications onPressButton={jest.fn()} buttonDisabled />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a button with custom text', () => {
    const tree = renderer.create(
      <AskNotifications
        onPressButton={jest.fn()}
        buttonText={'Custom button text'}
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide component', () => {
    const tree = renderer.create(
      <AskNotifications
        onPressSecondary={jest.fn()}
        secondaryNavText={'Later'}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
