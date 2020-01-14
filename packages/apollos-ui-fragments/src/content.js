import gql from 'graphql-tag';

export const CONTENT_ITEM_FRAGMENT = gql`
  fragment contentItemFragment on ContentItem {
    id
    title
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

export const CONTENT_CARD_FRAGMENT = gql`
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

export const CONTENT_MEDIA_FRAGMENT = gql`
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
