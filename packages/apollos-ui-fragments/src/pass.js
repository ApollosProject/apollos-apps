import gql from 'graphql-tag';

export const PASS_FRAGMENT = gql`
  fragment PassFragment on Pass {
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
`;
