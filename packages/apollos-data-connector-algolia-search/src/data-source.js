/* eslint-disable no-await-in-loop */
import { graphql } from 'graphql';
import ApollosConfig from '@apollosproject/config';
import algoliasearch from 'algoliasearch';
import {
  parseCursor,
  createCursor,
  createGlobalId,
} from '@apollosproject/server-core';

export default class Search {
  client = algoliasearch(
    ApollosConfig.ALGOLIA.APPLICATION_ID,
    ApollosConfig.ALGOLIA.API_KEY
  );

  index = this.client.initIndex(ApollosConfig.ALGOLIA.SEARCH_INDEX);

  initialize({ context }) {
    this.context = context;
  }

  async addObjects(args) {
    return new Promise((resolve, reject) => {
      this.index.addObjects(args, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  async mapItemToAlgolia(item) {
    const { ContentItem } = this.context.dataSources;
    const type = await ContentItem.resolveType(item);

    const { data } = await graphql(
      this.context.schema,
      `
query getItem {
  node(id: "${createGlobalId(item.id, type)}") {
    ... on ContentItem {
      id
      title
      summary
      objectID: id
      __typename
      coverImage { sources { uri } }
    }
  }
}`,
      {},
      this.context
    );
    return data.node;
  }

  async indexAll() {
    await new Promise((resolve, reject) =>
      this.index.clearIndex((err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      })
    );
    const { ContentItem } = this.context.dataSources;
    let itemsLeft = true;
    const args = { after: null, first: 100 };

    while (itemsLeft) {
      const { edges } = await ContentItem.paginate({
        cursor: ContentItem.byActive(),
        args,
      });

      const result = await edges;
      const items = result.map(({ node }) => node);
      itemsLeft = items.length === 100;

      if (itemsLeft) args.after = result[result.length - 1].cursor;

      const indexableItems = await Promise.all(
        items.map((item) => this.mapItemToAlgolia(item))
      );

      await this.addObjects(indexableItems);
    }
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
