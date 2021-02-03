import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-test-utils';
import PrayerCard from '../PrayerCard';

import PrayerView from '.';

describe('The PrayerView component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerView />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with children', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerView>
          <Text>Boom</Text>
        </PrayerView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state (isLoading)', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerView onPressSecondary={jest.fn()}>
          <PrayerCard />
        </PrayerView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept an onPressPrimary function', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerView onPressPrimary={jest.fn()} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept an onPressSecondary function', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerView onPressSecondary={jest.fn()} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with custom primaryActionText', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerView primaryActionText={'Custom primaryActionText'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with custom secondaryActionText', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerView secondaryActionText={'Custom secondaryActionText'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
