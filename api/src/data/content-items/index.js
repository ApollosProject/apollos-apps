import { gql } from 'apollo-server';
import { createGlobalId } from '../node';
import { createCursor, parseCursor } from '../../utils/cursor';

export { default as model } from './model';

export const schema = gql`
  type ContentItem implements Node {
    id: ID!
    title: String

    childrenContentItems(first: Int, after: String): ContentItemsConnection
  }

  type ContentItemsConnection {
    edges: [ContentItemsConnectionEdge]
    # totalCount: Int
    # pageInfo: Pagination
  }

  type ContentItemsConnectionEdge {
    node: ContentItem
    cursor: String
  }
`;

export const resolver = {
  ContentItem: {
    id: ({ id }, _, $, { parentType }) => createGlobalId(id, parentType.name),
    childrenContentItems: async ({ id }, pagination, { models }) => ({
      cursor: await models.ContentItem.getCursorByParentContentItemId(id),
      pagination,
    }),
  },
  ContentItemsConnection: {
    edges: async ({ cursor, pagination: { after, first = 20 } }) => {
      let skip = 0;
      if (after) {
        const parsed = parseCursor(after);
        if (parsed && Object.hasOwnProperty.call(parsed, 'position')) {
          skip = parsed.position + 1;
        }
      }

      const items = await cursor
        .top(first)
        .skip(skip)
        .get();

      return items.map((node, i) => ({
        node,
        cursor: createCursor({ position: i + skip }),
      }));
    },
  },
};
