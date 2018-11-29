import { gql } from 'apollo-server';

export default gql`
  type Interaction implements Node {
    id: ID!
    operation: LIKE_OPERATION!
    interactionDateTime: String!
  }

  enum LIKE_OPERATION {
    Like
    Unlike
  }

  input LikeEntityInput {
    nodeId: ID!
    operation: LIKE_OPERATION!
  }

  extend type Mutation {
    updateLikeEntity(input: LikeEntityInput!): ContentItem
  }

  extend interface ContentItem {
    isLiked: Boolean
    likedCount: Int
  }

  extend type DevotionalContentItem {
    isLiked: Boolean
    likedCount: Int
  }

  extend type UniversalContentItem {
    isLiked: Boolean
    likedCount: Int
  }

  extend type MediaContentItem {
    isLiked: Boolean
    likedCount: Int
  }

  extend type ContentSeriesContentItem {
    isLiked: Boolean
    likedCount: Int
  }

  extend type Query {
    getAllLikedContent: [ContentItem]
  }
`;
