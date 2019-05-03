import gql from 'graphql-tag';

export default gql`
  query getPushPermissions {
    notificationsEnabled @client(always: true)
  }
`;
