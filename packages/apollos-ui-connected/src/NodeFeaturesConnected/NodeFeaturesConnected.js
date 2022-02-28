import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { ErrorCard, named } from '@apollosproject/ui-kit';
import { useNavigation } from '@react-navigation/native';

import FeaturesFeedConnected, {
  FEATURE_FEED_ACTION_MAP,
} from '../FeaturesFeedConnected';
import RockAuthedWebBrowser from '../RockAuthedWebBrowser';
import GET_NODE_FEATURES from './getNodeFeatures';

function handleOnPress({ action, ...props }) {
  if (FEATURE_FEED_ACTION_MAP[action]) {
    FEATURE_FEED_ACTION_MAP[action]({ action, ...props });
  }
}

const NodeFeaturesConnected = ({ Component, nodeId, ...props }) => {
  const navigation = useNavigation();

  const { data, loading, error } = useQuery(GET_NODE_FEATURES, {
    fetchPolicy: 'cache-and-network',
    variables: { nodeId },
  });

  if (error) return <ErrorCard error={error} />;
  if (loading) return null;
  if (!data?.node?.featureFeed?.id) return null;

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <Component
          openUrl={openUrl}
          featureFeedId={data?.node?.featureFeed?.id}
          onPressActionItem={handleOnPress}
          navigation={navigation}
          {...props}
        />
      )}
    </RockAuthedWebBrowser>
  );
};

NodeFeaturesConnected.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  nodeId: PropTypes.string.isRequired,
};

NodeFeaturesConnected.defaultProps = {
  Component: FeaturesFeedConnected,
};

export default named('ui-connected.NodeFeaturesConnected')(
  NodeFeaturesConnected
);
