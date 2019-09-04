import ApollosConfig from '@apollosproject/config';
import algoliasearch from 'algoliasearch';

import { parseCursor, createCursor } from '@apollosproject/server-core';

const { ALGOLIA } = ApollosConfig;

export default class Search {
  client = algoliasearch(ALGOLIA.APPLICATION_ID, ALGOLIA.API_KEY);

  index = this.client.initIndex(ALGOLIA.SEARCH_INDEX);

  initialize({ context }) {
    this.context = context;
  }

  // TODO: abstract to a separate utility function
  proxyLoader = (node) => {
    let didLoad = false;
    let loadedObject = {};

    return new Proxy(node, {
      get: async (target, path) => {
        if (didLoad) return loadedObject[path] || target[path];
        if (Object.hasOwnProperty.call(node, path)) return node[path];

        loadedObject = await this.context.dataSources.Node.get(node.id);
        didLoad = true;

        return loadedObject[path];
      },
    });
  };

  async byPaginatedQuery({ query, after, first = 20 }) {
    console.log('context', this.context);
    const length = first;
    let offset = 0;
    if (after) {
      const parsed = parseCursor(after);
      if (parsed && Object.hasOwnProperty.call(parsed, 'position')) {
        offset = parsed.position + 1;
      } else {
        throw new Error(`An invalid 'after' cursor was provided: ${after}`);
      }
    }
    const { hits } = await this.index.search({ query, length, offset });
    return hits.map((node, i) => ({
      node: this.proxyLoader(node),
      cursor: createCursor({ position: i + offset }),
    }));
  }
}
