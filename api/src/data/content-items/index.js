import { gql } from 'apollo-server';
import { createGlobalId } from '../node';

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
    childrenContentItems: async ({ id }, input, { models }) =>
      models.ContentItem.paginate({
        cursor: await models.ContentItem.getCursorByParentContentItemId(id),
        input,
      }),
  },
};
