import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-test-utils';

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
  it('should render a loading state (isLoading)', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerCard isLoading />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerCard title={'Custom title text. Boom.'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a prayer', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerCard prayer={'Test prayer. Boom.'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
