import gql from 'graphql-tag';

const TEXT_FEATURE_FRAGMENT = gql`
  fragment TextFeatureFragment on TextFeature {
    body
    id
    sharing {
      message
    }
  }
`;

const SCRIPTURE_FEATURE_FRAGMENT = gql`
  fragment ScriptureFeatureFragment on ScriptureFeature {
    sharing {
      message
    }
    scriptures {
      id
      html
      reference
      copyright
      version
    }
  }
`;

export { TEXT_FEATURE_FRAGMENT, SCRIPTURE_FEATURE_FRAGMENT };
