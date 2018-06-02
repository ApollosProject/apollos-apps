import { gql } from 'apollo-server';
import sanitizeHtml from '../../utils/sanitize-html';
import { createGlobalId } from '../node';

export { default as model } from './model';

export const schema = gql`
  type ContentItem implements Node {
    id: ID!
    title: String

    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection

    htmlContent: String
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
    htmlContent: ({ content }) => sanitizeHtml(content),
    childContentItemsConnection: ({ id }, input, { models }) =>
      models.ContentItem.paginate({
        cursor: models.ContentItem.byParentContentItemId(id),
        input,
      }),
  },
};
