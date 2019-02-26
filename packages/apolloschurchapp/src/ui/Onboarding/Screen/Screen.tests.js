import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';

import Screen from '.';

describe('The Onboarding Screen component', () => {
  it('should render children', () => {
    const tree = renderer.create(
      <Providers>
        <Screen>
          <Text>Boom</Text>
        </Screen>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render onboarding next button navigation', () => {
    const tree = renderer.create(
      <Providers>
        <Screen onboardingScrollBy={jest.fn()}>
          <Text>Boom</Text>
        </Screen>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render onboarding skip button navigation', () => {
    const tree = renderer.create(
      <Providers>
        <Screen onboardingScrollBy={jest.fn()} onboardingSkipTo={jest.fn()}>
          <Text>Boom</Text>
        </Screen>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should hide onboarding primary navigation button', () => {
    const tree = renderer.create(
      <Providers>
        <Screen
          onboardingScrollBy={jest.fn()}
          onboardingSkipTo={jest.fn()}
          hidePrimaryNav
        >
          <Text>Boom</Text>
        </Screen>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
