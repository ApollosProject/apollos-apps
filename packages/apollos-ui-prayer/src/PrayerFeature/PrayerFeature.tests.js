import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '../testUtils';

import PrayerFeature from '.';

describe('The PrayerFeature component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render without a `Card` border', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature isCard={false} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with a title', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature title={'Example title'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom subtitle', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature subtitle={'Custom subtitle'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature isLoading title={'Example title'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state without a `Card` border', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature isLoading title={'Example title'} isCard={false} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
