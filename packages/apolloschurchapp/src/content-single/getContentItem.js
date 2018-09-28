import gql from 'graphql-tag';

export const contentItemFragment = gql`
  fragment contentItemFragment on ContentItem {
    id
    title
    isLiked
    coverImage {
      name
      sources {
        uri
      }
    }
    theme {
      type
      colors {
        primary
        secondary
        screen
        paper
      }
    }
  }
`;

export default gql`
  query getContentItem($itemId: ID!) {
    node(id: $itemId) {
      ... on ContentItem {
        ...contentItemFragment
      }
    }
  }
  ${contentItemFragment}
`;
