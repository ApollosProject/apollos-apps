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

const FEED_FEATURES_FRAGMENT = gql`
  fragment FeedFeaturesFragment on Feature {
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
    ...WebviewFeatureFragment
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

const NODE_FEATURES_FRAGMENT = gql`
  fragment NodeFeaturesFragment on FeaturesNode {
    features {
      ...FeaturesFragment
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
  }
`;

export {
  TEXT_FEATURE_FRAGMENT,
  SCRIPTURE_FEATURE_FRAGMENT,
  CARD_FEATURES_FRAGMENT,
  FEATURES_FRAGMENT,
  ACTION_LIST_FEATURE_FRAGMENT,
  HERO_LIST_FEATURE_FRAGMENT,
  HORIZONTAL_CARD_LIST_FEATURE_FRAGMENT,
  VERTICAL_CARD_LIST_FEATURE_FRAGMENT,
  FEED_FEATURES_FRAGMENT,
  WEBVIEW_FEATURE_FRAGMENT,
  PRAYER_LIST_FEATURE_FRAGMENT,
  RELATED_NODE_FRAGMENT,
  NODE_FEATURES_FRAGMENT,
};
