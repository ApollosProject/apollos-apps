import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

const GET_CONTENT_CARD = gql`
  query getContentCard($contentId: ID!) {
    node(id: $contentId) {
      id
      __typename
      ...contentCardFragment
      ...CardNodeFragment
      ...ThemedNodeFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.CARD_NODE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.THEMED_NODE_FRAGMENT}
`;

export default GET_CONTENT_CARD;
