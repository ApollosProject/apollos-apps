import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHookProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';

import httpLink from './httpLink';

const link = ApolloLink.from([httpLink]);
const cache = new InMemoryCache();

export const client = new ApolloClient({
  link,
  cache,
});

// Hack to give auth link access to method on client;
// eslint-disable-next-line prefer-destructuring

class ClientProvider extends PureComponent {
  static propTypes = {
    client: PropTypes.shape({
      cache: PropTypes.shape({}),
    }),
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.object, // covers Fragments
    ]).isRequired,
  };

  static defaultProps = {
    client,
  };

  render() {
    const { children, ...otherProps } = this.props;
    return (
      <ApolloProvider {...otherProps} client={client}>
        <ApolloHookProvider {...otherProps} client={client}>
          {children}
        </ApolloHookProvider>
      </ApolloProvider>
    );
  }
}

export default ClientProvider;
