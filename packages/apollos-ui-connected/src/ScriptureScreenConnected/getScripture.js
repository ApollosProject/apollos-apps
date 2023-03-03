import ApollosConfig from '@apollosproject/config';
import { gql } from '@apollo/client';

export default gql`
  query GetScriptures($reference: String!) {
    scriptures(query: $reference) {
      ...ScriptureFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.SCRIPTURE_FRAGMENT}
`;
