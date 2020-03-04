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

const FEATURES_FRAGMENT = gql`
  fragment FeaturesFragment on Feature {
    id
    ...TextFeatureFragment
    ...ScriptureFeatureFragment
  }
`;

const CARD_FEATURES_FRAGMENT = gql`
  fragment CardFeaturesFragment on ContentItem {
    ... on ContentSeriesContentItem {
      features {
        ...FeaturesFragment
      }
    }
    ... on WeekendContentItem {
      features {
        ...FeaturesFragment
      }
    }
  }
`;

export {
  TEXT_FEATURE_FRAGMENT,
  SCRIPTURE_FEATURE_FRAGMENT,
  CARD_FEATURES_FRAGMENT,
  FEATURES_FRAGMENT,
};
