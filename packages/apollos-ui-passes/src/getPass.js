import gql from 'graphql-tag';

export default gql`
  query {
    userPass {
      id
      description
      logo {
        uri
      }
      thumbnail {
        uri
      }
      barcode {
        uri
      }
      primaryFields {
        key
        label
        value
        textAlignment
      }
      secondaryFields {
        key
        label
        value
        textAlignment
      }
      backgroundColor
      foregroundColor
      labelColor
      passkitFileUrl
    }
  }
`;
