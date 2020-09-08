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

export { VIDEO_NODE_FRAGMENT, CONTENT_NODE_FRAGMENT };
