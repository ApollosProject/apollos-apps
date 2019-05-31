import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer from 'react-test-renderer';
import withTrackOnPress from './withTrackOnPress';
import { ProviderStack } from './testUtils';

// TODO: We should use enzyme to trigger the onPress prop.
// Otherwise these tests are pretty much useless.

describe('withOnPressTrack', () => {
  it('renders with a tracking object that includes trackEventName', () => {
    const Button = withTrackOnPress(TouchableOpacity);
    const tree = renderer.create(
      <ProviderStack>
        <Button trackEventName="SomeEvent" onPress={jest.fn()} />
      </ProviderStack>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders with a tracking object that includes trackProperties', () => {
    const Button = withTrackOnPress(TouchableOpacity);
    const tree = renderer.create(
      <ProviderStack>
        <Button
          trackEventName="SomeEvent"
          trackProperties={{ ItemId: '123' }}
          onPress={jest.fn()}
        />
      </ProviderStack>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders with a tracking object that excludes eventName', () => {
    const Button = withTrackOnPress(TouchableOpacity);
    const tree = renderer.create(
      <ProviderStack>
        <Button onPress={jest.fn()} />
      </ProviderStack>
    );
    expect(tree).toMatchSnapshot();
  });
});
