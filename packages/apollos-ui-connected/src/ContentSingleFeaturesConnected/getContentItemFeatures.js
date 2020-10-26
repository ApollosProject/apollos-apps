import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

const {
  TEXT_FEATURE_FRAGMENT,
  SCRIPTURE_FEATURE_FRAGMENT,
  WEBVIEW_FEATURE_FRAGMENT,
  CARD_FEATURES_FRAGMENT,
  NODE_FEATURES_FRAGMENT,
} = ApollosConfig.FRAGMENTS;

export default gql`
  query contentItemFeatures($contentId: ID!) {
    node(id: $contentId) {
      id
      ...CardFeaturesFragment
      ...NodeFeaturesFragment
    }
  }
  ${TEXT_FEATURE_FRAGMENT}
  ${SCRIPTURE_FEATURE_FRAGMENT}
  ${WEBVIEW_FEATURE_FRAGMENT}
  ${CARD_FEATURES_FRAGMENT}
  ${NODE_FEATURES_FRAGMENT}
`;
