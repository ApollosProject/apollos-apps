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

describe('The PrayerFeature component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature avatars={avatars} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render without a `Card` border', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature avatars={avatars} isCard={false} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature avatars={avatars} isLoading title={'Example title'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state without a `Card` border', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature
          avatars={['', '', '', '', '', '', '', '']}
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
        <PrayerFeature avatars={avatars} onPressAdd={jest.fn()} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept an onPressAvatar function', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature avatars={avatars} onPressAvatar={jest.fn()} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with a title', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature avatars={avatars} title={'Example title'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom subtitle', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature avatars={avatars} subtitle={'Custom subtitle'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
