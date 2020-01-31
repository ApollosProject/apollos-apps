import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

const GET_CONTENT_CARD = gql`
  query getContentCard($contentId: ID!) {
    node(id: $contentId) {
      ...contentCardFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
`;

export default GET_CONTENT_CARD;
