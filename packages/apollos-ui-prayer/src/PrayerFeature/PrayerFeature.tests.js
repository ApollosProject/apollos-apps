import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '../testUtils';

import PrayerFeature from '.';

const avatars = [
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
];

const prayers = avatars.map((avatar, i) => ({
  id: `prayer-${i}`,
  requestor: {
    photo: { uri: avatar },
  },
}));

describe('The PrayerFeature component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render without a `Card` border', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} isCard={false} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} isLoading title={'Example title'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state without a `Card` border', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature
          prayers={[{}, {}, {}, {}, {}, {}]}
          isCard={false}
          isLoading
          title={'Example title'}
        />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept an onPressAdd function', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} onPressAdd={jest.fn()} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept an onPressAvatar function', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} onPressAvatar={jest.fn()} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with a title', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} title={'Example title'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom subtitle', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} subtitle={'Custom subtitle'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
