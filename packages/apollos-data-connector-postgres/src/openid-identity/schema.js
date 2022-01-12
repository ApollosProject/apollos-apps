import gql from 'graphql-tag';

const schema = gql`
  type OpenIdProvider {
    authorizationUrl: String
    providerType: String
  }

  type ConnectOpenIdResult {
    success: Boolean
    # ...TBD
  }

  extend type Query {
    openIdProviders: [OpenIdProvider]
  }

  extend type Mutation {
    connectOpenId(code: String!, providerType: String!): ConnectOpenIdResult
  }
`;

export default schema;
