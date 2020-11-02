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

const PRAYER_LIST_FEATURE_FRAGMENT = gql`
  fragment PrayerListFeatureFragment on PrayerListFeature {
    id
    title
    subtitle
    isCard
    prayers {
      __typename
      id
      text
      isPrayed
      requestor {
        id
        nickName
        firstName
        photo {
          uri
        }
      }
    }
  }
`;

const LITE_FEATURES_FRAGMENT = gql`
  fragment LiteFeaturesFragment on Feature {
    id
    __typename
    ... on VerticalCardListFeature {
      isFeatured
      title
      subtitle
    }
    ... on HorizontalCardListFeature {
      title
      subtitle
    }
    ... on ActionListFeature {
      title
      subtitle
    }
    ... on HeroListFeature {
      title
      subtitle
    }
    ... on PrayerListFeature {
      title
      subtitle
      isCard
    }
    ... on TextFeature {
      body
    }
    ... on ScriptureFeature {
      scriptures {
        reference
      }
    }
    ... on WebviewFeature {
      title
    }
  }
`;

// TODO: deprecated, name change
const FEED_FEATURES_FRAGMENT = LITE_FEATURES_FRAGMENT;

// TODO deprecated
const FEATURES_FRAGMENT = gql`
  fragment FeaturesFragment on Feature {
    id
    ...TextFeatureFragment
    ...ScriptureFeatureFragment
    ...WebviewFeatureFragment
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

const CARD_FEATURES_FRAGMENT = gql`
  fragment CardFeaturesFragment on ContentItem {
    ... on ContentSeriesContentItem {
      features {
        id
        ...TextFeatureFragment
        ...ScriptureFeatureFragment
        ...WebviewFeatureFragment
      }
    }
    ... on WeekendContentItem {
      features {
        id
        ...TextFeatureFragment
        ...ScriptureFeatureFragment
        ...WebviewFeatureFragment
      }
    }
  }
`;

const NODE_FEATURES_FRAGMENT = gql`
  fragment NodeFeaturesFragment on FeaturesNode {
    features {
      id
      ...TextFeatureFragment
      ...ScriptureFeatureFragment
      ...WebviewFeatureFragment
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
        ...RelatedFeatureNodeFragment
      }
    }
    primaryAction {
      title
      action
      relatedNode {
        ...RelatedFeatureNodeFragment
      }
    }
  }
`;

const ACTION_BAR_FEATURE_FRAGMENT = gql`
  fragment ActionBarFeatureFragment on ActionBarFeature {
    id
    title
    actions {
      id
      title
      icon
      action
      relatedNode {
        ...RelatedFeatureNodeFragment
      }
    }
  }
`;

const HERO_LIST_FEATURE_FRAGMENT = gql`
  fragment HeroListFeatureFragment on HeroListFeature {
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
        ...RelatedFeatureNodeFragment
      }
    }
    primaryAction {
      title
      action
      relatedNode {
        ...RelatedFeatureNodeFragment
      }
    }
    heroCard {
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
        ...RelatedFeatureNodeFragment
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
        ...RelatedFeatureNodeFragment
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
        ...RelatedFeatureNodeFragment
      }
    }
    primaryAction {
      title
      action
      relatedNode {
        ...RelatedFeatureNodeFragment
      }
    }
  }
`;

const WEBVIEW_FEATURE_FRAGMENT = gql`
  fragment WebviewFeatureFragment on WebviewFeature {
    linkText
    title
    url
  }
`;

const RELATED_NODE_FRAGMENT = gql`
  fragment RelatedFeatureNodeFragment on Node {
    id
    ... on Url {
      url
    }
    ... on ContentChannel {
      name
    }
  }
`;

export {
  TEXT_FEATURE_FRAGMENT,
  SCRIPTURE_FEATURE_FRAGMENT,
  CARD_FEATURES_FRAGMENT,
  FEATURES_FRAGMENT,
  ACTION_LIST_FEATURE_FRAGMENT,
  ACTION_BAR_FEATURE_FRAGMENT,
  HERO_LIST_FEATURE_FRAGMENT,
  HORIZONTAL_CARD_LIST_FEATURE_FRAGMENT,
  VERTICAL_CARD_LIST_FEATURE_FRAGMENT,
  FEED_FEATURES_FRAGMENT,
  LITE_FEATURES_FRAGMENT,
  WEBVIEW_FEATURE_FRAGMENT,
  PRAYER_LIST_FEATURE_FRAGMENT,
  RELATED_NODE_FRAGMENT,
  NODE_FEATURES_FRAGMENT,
};
