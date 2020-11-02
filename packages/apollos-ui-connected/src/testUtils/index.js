/* eslint-disable import/prefer-default-export */
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import apolloStorybookDecorator from 'apollo-storybook-react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';
import { Providers as UIProviders } from '@apollosproject/ui-kit';
import { MockedProvider } from 'react-apollo/test-utils';
import possibleTypesJson from './fragmentTypes.json';
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

const ApolloStorybookDecorator = ({
  mocks,
  additionalSchema = [],
  possibleTypes = {},
}) => {
  // We can use this way simpler code long term when we upgrade to Apollo 3.
  // const finalPossibleTypes = possibleTypes;
  // possibleTypesJson.__schema.types.forEach((supertype) => {
  //   if (supertype.possibleTypes) {
  //     finalPossibleTypes[supertype.name] = [
  //       ...supertype.possibleTypes.map((subtype) => subtype.name),
  //       ...(possibleTypes[supertype.name] || []),
  //     ];
  //   }
  // });
  const finalPossibleTypes = possibleTypesJson;
  Object.keys(possibleTypes).forEach((key) => {
    const jsonTypeIndex = possibleTypesJson.__schema.types.findIndex(
      ({ name }) => name === key
    );
    const newTypePossibleTypes = {
      ...possibleTypesJson.__schema.types[jsonTypeIndex],
      possibleTypes: [
        ...possibleTypesJson.__schema.types[jsonTypeIndex].possibleTypes,
        ...possibleTypes[key].map((type) => ({ name: type })),
      ],
    };
    possibleTypesJson.__schema.types[jsonTypeIndex] = newTypePossibleTypes;
  });
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: finalPossibleTypes,
  });

  return apolloStorybookDecorator({
    typeDefs: [typeDefs, ...additionalSchema],
    mocks,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    cacheOptions: { fragmentMatcher },
  });
};

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
