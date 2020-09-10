/* eslint-disable import/prefer-default-export */
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import apolloStorybookDecorator from 'apollo-storybook-react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';
import { Providers as UIProviders } from '@apollosproject/ui-kit';
import { MockedProvider } from 'react-apollo/test-utils';
import possibleTypes from './fragmentTypes.json';
import typeDefs from './typeDefsMock';

const renderWithApolloData = async (component, existingTree) => {
  const tree = existingTree || renderer.create(component);
  await wait(1);
  tree.update(component);
  return tree;
};

// eslint-disable-next-line
const Providers = ({ children, ...props }) => (
  <UIProviders {...props}>
    <MockedProvider {...props}>{children}</MockedProvider>
  </UIProviders>
);

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: possibleTypes,
});

const ApolloStorybookDecorator = ({ mocks }) =>
  apolloStorybookDecorator({
    typeDefs,
    mocks,
    cacheOptions: { fragmentMatcher },
  });

const WithReactNavigator = (Component) => {
  const AppNavigator = createStackNavigator({
    Home: {
      screen: () => Component,
      navigationOptions: {
        headerMode: 'none',
        header: null,
      },
    },
  });

  const AppContainer = createAppContainer(AppNavigator);
  return <AppContainer />;
};
export {
  renderWithApolloData,
  Providers,
  ApolloStorybookDecorator,
  WithReactNavigator,
};
