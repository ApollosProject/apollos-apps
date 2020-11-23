import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer from 'react-test-renderer';
import { Providers as TestProviders } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';
import withTrackOnPress from './withTrackOnPress';
import AnalyticsProvider from './Provider';

const trackMock = jest.fn();

// eslint-disable-next-line
const ProviderStack = ({ children }) => (
  <TestProviders MockedProvider={MockedProvider}>
    <AnalyticsProvider trackFunctions={[trackMock]}>
      {children}
    </AnalyticsProvider>
  </TestProviders>
);
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
