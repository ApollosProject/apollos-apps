import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider, ApolloClient, ApolloLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';

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
        {children}
      </ApolloProvider>
    );
  }
}

export default ClientProvider;
