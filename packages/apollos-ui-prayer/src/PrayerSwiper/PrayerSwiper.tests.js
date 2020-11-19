import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import renderer from 'react-test-renderer';
import { Providers } from '@apollosproject/ui-test-utils';
import PrayerSwiper from '.';

describe('The PrayerSwiper component', () => {
  it('should render with a fragment as a child', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerSwiper>
          {({ swipeForward, scrollBy }) => (
            <>
              <TouchableOpacity onPress={swipeForward}>
                <Text>1</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={swipeForward}>
                <Text>2</Text>
              </TouchableOpacity>
              <TouchableOpacity key="3" onPress={() => scrollBy(-1)}>
                <Text>3</Text>
              </TouchableOpacity>
            </>
          )}
        </PrayerSwiper>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with an array as a child', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerSwiper>
          {({ swipeForward, scrollBy }) => [
            <TouchableOpacity key="1" onPress={swipeForward}>
              <Text>1</Text>
            </TouchableOpacity>,
            <TouchableOpacity key="2" onPress={swipeForward}>
              <Text>2</Text>
            </TouchableOpacity>,
            <TouchableOpacity key="3" onPress={() => scrollBy(-1)}>
              <Text>3</Text>
            </TouchableOpacity>,
          ]}
        </PrayerSwiper>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
