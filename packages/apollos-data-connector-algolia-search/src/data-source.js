import ApollosConfig from '@apollosproject/config';
import algoliasearch from 'algoliasearch';

import { parseCursor, createCursor } from '@apollosproject/server-core';

const { ALGOLIA } = ApollosConfig;

export default class Search {
  client = algoliasearch(ALGOLIA.APPLICATION_ID, ALGOLIA.API_KEY);

  index = this.client.initIndex(ALGOLIA.SEARCH_INDEX);

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
      node,
      cursor: createCursor({ position: i + offset }),
    }));
  }
}
