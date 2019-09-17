import ApollosConfig from '@apollosproject/config';
import algoliasearch from 'algoliasearch';

import { parseCursor, createCursor } from '@apollosproject/server-core';

export default class Search {
  client = algoliasearch(
    ApollosConfig.ALGOLIA.APPLICATION_ID,
    ApollosConfig.ALGOLIA.API_KEY
  );

  index = this.client.initIndex(ApollosConfig.ALGOLIA.SEARCH_INDEX);

  initialize({ context }) {
    this.context = context;
  }

  async byPaginatedQuery({ query, after, first = 20 }) {
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
      ...node,
      cursor: createCursor({ position: i + offset }),
    }));
  }
}
