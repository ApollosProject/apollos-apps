import gql from 'graphql-tag';

const CONTENT_UP_NEXT_FRAGMENT = gql`
  fragment ContentUpNextFragment on ContentItem {
    ... on ProgressNode {
      upNext {
        id
      }
    }
    ... on ContentParentNode {
      childContentItemsConnection {
        edges {
          node {
            id
          }
        }
      }
    }
    ... on ContentSeriesContentItem {
      id
      upNext {
        id
      }
      childContentItemsConnection {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

const CONTENT_ITEM_FRAGMENT = gql`
  fragment contentItemFragment on ContentItem {
    id
    title
    publishDate
    summary
    htmlContent
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
    parentChannel {
      id
      name
    }
    videos {
      sources {
        uri
      }
    }
    audios {
      sources {
        uri
      }
    }
  }
`;

const CONTENT_SINGLE_FRAGMENT = gql`
  fragment ContentSingleFragment on ContentItem {
    title
    htmlContent
    coverImage {
      sources {
        uri
      }
    }
  }
`;

const CONTENT_CARD_FRAGMENT = gql`
  fragment contentCardFragment on ContentItem {
    id
    __typename
    coverImage {
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
    title
    hyphenatedTitle: title(hyphenated: true)
    summary
    ... on MediaContentItem {
      videos {
        sources {
          uri
        }
      }
      parentChannel {
        id
        name
      }
    }
    ... on WeekendContentItem {
      videos {
        sources {
          uri
        }
      }
      parentChannel {
        id
        name
      }
    }
    ... on DevotionalContentItem {
      parentChannel {
        id
        name
      }
    }
  }
`;

const CONTENT_MEDIA_FRAGMENT = gql`
  fragment contentMediaFragment on ContentItem {
    id
    title
    parentChannel {
      id
      name
    }
    coverImage {
      sources {
        uri
      }
    }
    videos {
      sources {
        uri
      }
    }
  }
`;

export {
  CONTENT_ITEM_FRAGMENT,
  CONTENT_SINGLE_FRAGMENT,
  CONTENT_CARD_FRAGMENT,
  CONTENT_MEDIA_FRAGMENT,
  CONTENT_UP_NEXT_FRAGMENT,
};
