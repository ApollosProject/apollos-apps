import React from 'react';
import { InMemoryCache } from '@apollo/client/cache';
import { graphql, print } from 'graphql';
import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  // addResolveFunctionsToSchema,
} from 'graphql-tools';

import {
  ApolloLink,
  Observable,
  ApolloProvider,
  ApolloClient,
} from '@apollo/client';
import typeDefs from './typeDefsMock';
import createPossibleType from './createPossibleType';

function delay(ms) {
  return new Promise((resolve) => {
    if (ms === 0) {
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function createLink(schema, rootValue = {}, context = {}, options = {}) {
  let delayMs = 300; // Default
  if (
    Object.prototype.hasOwnProperty.call(options, 'delayMs') &&
    typeof options.delayMs === 'number'
  ) {
    delayMs = options.delayMs;
  }
  return new ApolloLink((operation) => {
    return new Observable((observer) => {
      const { query, operationName, variables } = operation;
      delay(delayMs)
        .then(() => {
          return graphql(
            schema,
            print(query),
            rootValue,
            context,
            variables,
            operationName
          );
        })
        .then((result) => {
          observer.next(result);
          observer.complete();
        })
        .catch(observer.error.bind(observer));
    });
  });
}

const ApolloStorybookDecorator = ({
  mocks,
  additionalSchema = [],
  possibleTypes = {},
  rootValue,
  context,
  ...apolloOptions
}) => {
  const schema = makeExecutableSchema({
    typeDefs: [typeDefs, ...additionalSchema],
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
  });

  addMockFunctionsToSchema({
    schema,
    mocks,
  });

  const cache = new InMemoryCache({
    possibleTypes: createPossibleType({ possibleTypes }),
  });

  const client = new ApolloClient({
    addTypename: true,
    cache,
    link: ApolloLink.from([createLink(schema, rootValue, context)]),
    connectToDevTools: true,
    ...apolloOptions,
  });

  // eslint-disable-next-line react/display-name
  return (story) => {
    return <ApolloProvider client={client}>{story()}</ApolloProvider>;
  };
};

export default ApolloStorybookDecorator;
