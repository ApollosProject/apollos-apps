import { gql } from '@apollo/client';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query {
    userPass {
      ...PassFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.PASS_FRAGMENT}
`;
