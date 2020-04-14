import React, { memo } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import GET_FEED_FEATURES from './getFeedFeatures';
import FeaturesFeed from './FeaturesFeed';

const FeaturesFeedConnected = memo(({ Component, onPressActionItem }) => (
  <Query query={GET_FEED_FEATURES} fetchPolicy="cache-and-network">
    {({ data: features, loading }) => (
      <Component
        features={features}
        isLoading={loading}
        onPressActionItem={onPressActionItem}
      />
    )}
  </Query>
));

FeaturesFeedConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  onPressActionItem: PropTypes.func,
};

FeaturesFeedConnected.defaultProps = {
  Component: FeaturesFeed,
};

FeaturesFeedConnected.displayName = 'FeaturesFeedConnected';

export default FeaturesFeedConnected;
