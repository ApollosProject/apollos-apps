/* eslint-disable import/prefer-default-export */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
// import apolloStorybookDecorator from 'apollo-storybook-react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';
import { Providers as UIProviders } from '@apollosproject/ui-kit';
// import { MockedProvider } from '@apollo/client/testing';
// import { ApolloClient } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import possibleTypesJson from './fragmentTypes.json';
// import typeDefs from './typeDefsMock';

async function renderWithApolloData(component, existingTree) {
  const tree = existingTree || renderer.create(component);
  await renderer.act(async function() {
    await wait(0);
    tree.update(component);
  });
  return tree;
}

// eslint-disable-next-line
function Providers({ MockedProvider, children, ...props }){
  let MockedApolloProvider = React.Fragment;
  if (MockedProvider) {
    MockedApolloProvider = MockedProvider;
  }

  const finalPossibleTypes = {};
  possibleTypesJson.__schema.types.forEach((supertype) => {
    if (supertype.possibleTypes) {
      finalPossibleTypes[supertype.name] = [
        ...supertype.possibleTypes.map((subtype) => subtype.name),
        // ...(possibleTypes[supertype.name] || []),
      ];
    }
  });

  const cache = new InMemoryCache({
    possibleTypes: finalPossibleTypes,
  });

  return (
    <UIProviders {...props}>
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
    </UIProviders>
  );
}

const ApolloStorybookDecorator = ({
  // mocks,
  // additionalSchema = [],
  possibleTypes = {},
}) => {
  // We can use this way simpler code long term when we upgrade to Apollo 3.
  const finalPossibleTypes = possibleTypes;
  possibleTypesJson.__schema.types.forEach((supertype) => {
    if (supertype.possibleTypes) {
      finalPossibleTypes[supertype.name] = [
        ...supertype.possibleTypes.map((subtype) => subtype.name),
        ...(possibleTypes[supertype.name] || []),
      ];
    }
  });
  // const finalPossibleTypes = possibleTypesJson;
  // Object.keys(possibleTypes).forEach((key) => {
  //   const jsonTypeIndex = possibleTypesJson.__schema.types.findIndex(
  //     ({ name }) => name === key
  //   );
  //   const newTypePossibleTypes = {
  //     ...possibleTypesJson.__schema.types[jsonTypeIndex],
  //     possibleTypes: [
  //       ...possibleTypesJson.__schema.types[jsonTypeIndex].possibleTypes,
  //       ...possibleTypes[key].map((type) => ({ name: type })),
  //     ],
  //   };
  //   possibleTypesJson.__schema.types[jsonTypeIndex] = newTypePossibleTypes;
  // });
  // const fragmentMatcher = new IntrospectionFragmentMatcher({
  //   introspectionQueryResultData: finalPossibleTypes,
  // });

  // return apolloStorybookDecorator({
  //   typeDefs: [typeDefs, ...additionalSchema],
  //   mocks,
  //   resolverValidationOptions: {
  //     requireResolversForResolveType: false,
  //   },
  //   // cacheOptions: { fragmentMatcher },
  //   possibleTypes: finalPossibleTypes
  // });
};

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
  ApolloStorybookDecorator,
  WithReactNavigator,
};
