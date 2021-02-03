import React from 'react';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import { ErrorCard, named } from '@apollosproject/ui-kit';
import { get } from 'lodash';

import FeaturesFeedConnected from '../FeaturesFeedConnected';
import GET_NODE_FEATURES from './getNodeFeatures';

const NodeFeaturesConnected = ({ Component, nodeId, ...props }) => {
  if (!nodeId) return null;

  return (
    <Query
      query={GET_NODE_FEATURES}
      fetchPolicy="cache-and-network"
      variables={{ nodeId }}
    >
      {({ data: { node } = {}, loading, error }) => {
        if (error) return <ErrorCard error={error} />;
        // TODO: set an optimistic response for this query to return a visually appeallying empty query so we can enable loading states
        if (loading) return null;

        const featureFeedId = get(node, 'featureFeed.id');

        if (!featureFeedId) return null;

        return <Component featureFeedId={featureFeedId} {...props} />;
      }}
    </Query>
  );
};

NodeFeaturesConnected.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  nodeId: PropTypes.string,
};

NodeFeaturesConnected.defaultProps = {
  Component: FeaturesFeedConnected,
};

export default named('ui-connected.NodeFeaturesConnected')(
  NodeFeaturesConnected
);
