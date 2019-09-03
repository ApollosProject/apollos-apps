import ApollosConfig from '@apollosproject/config';
import algoliasearch from 'algoliasearch';

const { ALGOLIA } = ApollosConfig;

export default class Search {
  client = algoliasearch(ALGOLIA.APPLICATION_ID, ALGOLIA.API_KEY);

  index = this.client.initIndex(ALGOLIA.SEARCH_INDEX);

  async search({ query, first, after }) {
    const { hits } = await this.index.search({ query });
    return hits;
  }
}
