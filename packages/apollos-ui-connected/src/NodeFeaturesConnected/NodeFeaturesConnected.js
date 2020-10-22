import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { ErrorCard } from '@apollosproject/ui-kit';
import { get } from 'lodash';

import GET_NODE_FEATURES from './getNodeFeatures';
import NodeFeatures from './NodeFeatures';

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

        const features = get(node, 'features', []);
        if (!features || !features.length) return null;

        return (
          console.warn(
            'NodeFeaturesConnected is deprecated. Please use FeaturesFeedConnected.'
          ) || <Component nodeId={nodeId} features={features} {...props} />
        );
      }}
    </Query>
  );
};

NodeFeaturesConnected.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  nodeId: PropTypes.string,
};

NodeFeaturesConnected.defaultProps = {
  Component: NodeFeatures,
};

export default NodeFeaturesConnected;
