import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getContentMedia($nodeId: ID!) {
    node(id: $nodeId) {
      ... on ContentItem {
        ...contentMediaFragment
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_MEDIA_FRAGMENT}
`;
