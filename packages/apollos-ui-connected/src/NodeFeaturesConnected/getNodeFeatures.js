import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

const {
  TEXT_FEATURE_FRAGMENT,
  SCRIPTURE_FEATURE_FRAGMENT,
  WEBVIEW_FEATURE_FRAGMENT,
  NODE_FEATURES_FRAGMENT,
} = ApollosConfig.FRAGMENTS;

export default gql`
  query nodeFeatures($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ...NodeFeaturesFragment
    }
  }
  ${TEXT_FEATURE_FRAGMENT}
  ${SCRIPTURE_FEATURE_FRAGMENT}
  ${WEBVIEW_FEATURE_FRAGMENT}
  ${NODE_FEATURES_FRAGMENT}
`;
