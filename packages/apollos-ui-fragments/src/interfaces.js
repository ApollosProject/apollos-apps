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

export { VIDEO_NODE_FRAGMENT };
