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

const ACTION_LIST_FEATURE_FRAGMENT = gql`
  fragment ActionListFeatureFragment on ActionListFeature {
    id
    title
    subtitle
    actions {
      id
      title
      subtitle
      action
      image {
        sources {
          uri
        }
      }
      relatedNode {
        id
      }
    }
  }
`;

const VERTICAL_CARD_LIST_FEATURE_FRAGMENT = gql`
  fragment VerticalCardListFeatureFragment on VerticalCardListFeature {
    id
    isFeatured
    title
    subtitle
    cards {
      action
      title
      hasAction
      actionIcon
      labelText
      summary
      coverImage {
        sources {
          uri
        }
      }
      relatedNode {
        id
      }
    }
  }
`;

const HORIZONTAL_CARD_LIST_FEATURE_FRAGMENT = gql`
  fragment HorizontalCardListFeatureFragment on HorizontalCardListFeature {
    id
    title
    subtitle
    cards {
      action
      title
      hyphenatedTitle: title(hyphenated: true)
      hasAction
      actionIcon
      labelText
      summary
      coverImage {
        sources {
          uri
        }
      }
      relatedNode {
        id
      }
    }
  }
`;

export {
  TEXT_FEATURE_FRAGMENT,
  SCRIPTURE_FEATURE_FRAGMENT,
  CARD_FEATURES_FRAGMENT,
  FEATURES_FRAGMENT,
  ACTION_LIST_FEATURE_FRAGMENT,
  HORIZONTAL_CARD_LIST_FEATURE_FRAGMENT,
  VERTICAL_CARD_LIST_FEATURE_FRAGMENT,
};
