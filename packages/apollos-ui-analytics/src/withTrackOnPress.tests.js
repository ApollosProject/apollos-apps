import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer from 'react-test-renderer';
import withTrackOnPress from './withTrackOnPress';
import { ProviderStack } from './testUtils';

// TODO: We should use enzyme to trigger the onPress prop.
// Otherwise these tests are pretty much useless.

describe('withOnPressTrack', () => {
  it('Renders with an trackEventName', () => {
    const Button = withTrackOnPress(TouchableOpacity);
    const tree = renderer.create(
      <ProviderStack>
        <Button trackEventName="SomeEvent" onPress={jest.fn()} />
      </ProviderStack>
    );
    expect(tree).toMatchSnapshot();
  });

  it('Renders with an trackProperties', () => {
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

  it('Renders without an eventName', () => {
    const Button = withTrackOnPress(TouchableOpacity);
    const tree = renderer.create(
      <ProviderStack>
        <Button onPress={jest.fn()} />
      </ProviderStack>
    );
    expect(tree).toMatchSnapshot();
  });
});
