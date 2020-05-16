import React from 'react';
import renderer from 'react-test-renderer';
import { Providers } from '../testUtils';
import PrayerCard from '.';

describe('The PrayerCard component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerCard />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render an avatar', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerCard
          avatar={{
            uri: 'https://picsum.photos/400/400',
          }}
        />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with a cardColor', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerCard cardColor={'salmon'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerCard title={'Custom title text'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a prayer', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerCard
          prayer={
            'For my 15+ year old dog as she makes her journey from this life. she has been a joy and a blessing to us since we adopted her 12 years ago. Thank you Lord for giving us such a sweet and loving companion.'
          }
        />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
