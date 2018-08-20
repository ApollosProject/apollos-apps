import { gql } from 'apollo-server';

export default gql`
  type Session implements Node {
    id: ID!
  }

  type Interaction implements Node {
    id: ID!
    operation: INTERACTION_OPERATION!
    interactionDateTime: String!
  }

  enum INTERACTION_OPERATION {
    Like
    Unlike
  }

  input CreateInteractionInput {
    nodeId: String!
    sessionId: String!
    operation: INTERACTION_OPERATION!
  }

  extend type Mutation {
    createInteraction(input: CreateInteractionInput!): Interaction
    createSession: Session
  }
`;
