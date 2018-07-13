import { gql } from 'apollo-server';

export default gql`
  type LiveFeed {
    isLiveNow: Boolean!
  }
`;
