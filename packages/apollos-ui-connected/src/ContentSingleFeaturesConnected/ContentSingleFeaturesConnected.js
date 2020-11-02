import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { ErrorCard } from '@apollosproject/ui-kit';
import { get } from 'lodash';

import GET_CONTENT_ITEM_FEATURES from './getContentItemFeatures';
import ContentSingleFeatures from './ContentSingleFeatures';

const ContentSingleFeaturesConnected = ({
  Component,
  contentId,
  nodeId,
  ...props
}) => {
  if (!contentId && !nodeId) return null;

  return (
    <Query
      query={GET_CONTENT_ITEM_FEATURES}
      fetchPolicy="cache-and-network"
      variables={{ contentId: contentId || nodeId }}
    >
      {({ data: { node } = {}, loading, error }) => {
        if (error) return <ErrorCard error={error} />;
        // TODO: set an optimistic response for this query to return a visually appeallying empty query so we can enable loading states
        if (loading) return null;

        const features = get(node, 'features', []);
        if (!features || !features.length) return null;

        return (
          console.warn(
            'ContentSingleFeaturesConnected is deprecated. Please use ContentFeatureFeedConnected.'
          ) || (
            <Component
              contentId={contentId || nodeId}
              features={features}
              {...props}
            />
          )
        );
      }}
    </Query>
  );
};

ContentSingleFeaturesConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.func,
  ]),
  contentId: PropTypes.string,
  nodeId: PropTypes.string,
};

ContentSingleFeaturesConnected.defaultProps = {
  Component: ContentSingleFeatures,
};

export default ContentSingleFeaturesConnected;
