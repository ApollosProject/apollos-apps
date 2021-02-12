/* eslint-disable import/prefer-default-export */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';
import { Providers as UIProviders } from '@apollosproject/ui-kit';
import { InMemoryCache } from '@apollo/client/cache';
import createPossibleType from './createPossibleType';
import ApolloStorybookDecorator from './ApolloStorybookDecorator';
import fragmentTypes from './fragmentTypes.json';

async function renderWithApolloData(component, existingTree) {
  const tree = existingTree || renderer.create(component);
  await renderer.act(async function () {
    await wait(0);
    tree.update(component);
  });
  return tree;
}

// eslint-disable-next-line
function ApolloProvider({ MockedProvider, children, ...props }) {
  let MockedApolloProvider = React.Fragment;
  if (MockedProvider) {
    MockedApolloProvider = MockedProvider;
  }

  const cache = new InMemoryCache({
    possibleTypes: createPossibleType(),
  });

  return (
    <MockedApolloProvider
      {...(MockedProvider
        ? {
            defaultOptions: {
              watchQuery: { fetchPolicy: 'no-cache' },
              query: { fetchPolicy: 'no-cache' },
            },
            cache,
          }
        : {})}
      {...props}
    >
      {children}
    </MockedApolloProvider>
  );
}

// eslint-disable-next-line
function Providers({ children, ...props }) {
  return (
    <UIProviders {...props}>
      <ApolloProvider {...props}>{children}</ApolloProvider>
    </UIProviders>
  );
}

const WithReactNavigator = (Component) => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={() => Component} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export {
  renderWithApolloData,
  Providers,
  ApolloProvider,
  WithReactNavigator,
  ApolloStorybookDecorator,
  fragmentTypes,
};
