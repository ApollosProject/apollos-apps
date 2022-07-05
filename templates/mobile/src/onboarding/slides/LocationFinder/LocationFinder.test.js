import renderer from 'react-test-renderer';

import { GradientOverlayImage } from '@apollosproject/ui-kit';

import LocationFinder from './LocationFinder';

const campus = {
  id: 'Campus:a0f64573eabf00a607bec911794d50fb',
  name: 'Chicago Campus',
  latitude: 42.09203,
  longitude: -88.13289,
  distanceFromLocation: null,
  street1: '67 Algonquin Rd',
  street2: '',
  city: 'South Barrington',
  state: 'IL',
  postalCode: '60010-6143',
  image: {
    uri: 'https://picsum.photos/300/300/?random',
  },
};

describe('The Onboarding LocationFinder component', () => {
  it('should render', () => {
    const tree = renderer.create(<LocationFinder />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a BackgroundComponent', () => {
    const tree = renderer.create(
      <LocationFinder
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
      <LocationFinder slideTitle={'Custom title text'} />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <LocationFinder description={'Custom description text'} />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a button', () => {
    const tree = renderer.create(<LocationFinder onPressButton={jest.fn()} />);
    expect(tree).toMatchSnapshot();
  });
  it('should render the campus card', () => {
    const tree = renderer.create(
      <LocationFinder campus={campus} onPressPrimary={() => jest.fn()} />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a button with custom text', () => {
    const tree = renderer.create(
      <LocationFinder
        onPressButton={jest.fn()}
        buttonText={'Custom button text'}
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide component', () => {
    const tree = renderer.create(
      <LocationFinder onPressSecondary={jest.fn()} secondaryNavText={'Later'} />
    );
    expect(tree).toMatchSnapshot();
  });
});
