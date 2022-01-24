import algoliasearch from 'algoliasearch';
import { parseCursor, createCursor } from '@apollosproject/server-core';

export default class Search {
  initialize({ context }) {
    this.context = context;
  }

  get algoliaConfig() {
    return this.context.dataSources.Config?.ALGOLIA;
  }

  get client() {
    if (this._client) return this._client;
    if (this.algoliaConfig?.APPLICATION_ID && this.algoliaConfig?.API_KEY) {
      this._client = algoliasearch(
        this.algoliaConfig.APPLICATION_ID,
        this.algoliaConfig.API_KEY
      );
    } else {
      this._client = null;
    }
    return this._client;
  }

  get index() {
    if (this._index) return this._index;
    if (
      this.algoliaConfig?.APPLICATION_ID &&
      this.algoliaConfig?.API_KEY &&
      this.client
    ) {
      this._index = this.client.initIndex(
        `ContentItem_${this.context?.church?.slug}`
      );
      this._index.setSettings(
        this.algoliaConfig.CONFIGURATION || {
          searchableAttributes: ['title', 'unordered(summary)'],
          customRanking: ['desc(publishDate)'],
        }
      );
    } else {
      this._index = {
        search: () => ({ hits: [] }),
      };
    }
    return this._index;
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
