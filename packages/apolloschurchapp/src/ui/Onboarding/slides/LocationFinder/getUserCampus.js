import gql from 'graphql-tag';

export default gql`
  query getUserCampus {
    isCurrentCampus @client(always: true)
  }
`;
