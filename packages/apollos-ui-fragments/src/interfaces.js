import gql from 'graphql-tag';

const VIDEO_NODE_FRAGMENT = gql`
  fragment VideoNodeFragment on VideoNode {
    videos {
      sources {
        uri
      }
    }
  }
`;

const CONTENT_NODE_FRAGMENT = gql`
  fragment ContentNodeFragment on ContentNode {
    title
    htmlContent
    coverImage {
      sources {
        uri
      }
    }
  }
`;

const FEATURES_NODE_FRAGMENT = gql`
  fragment FeaturesNodeFragment on FeaturesNode {
    features {
      ...FeaturesFragment
    }
  }
`;

export { VIDEO_NODE_FRAGMENT, CONTENT_NODE_FRAGMENT, FEATURES_NODE_FRAGMENT };
