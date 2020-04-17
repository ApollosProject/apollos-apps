import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { FeedView } from '@apollosproject/ui-kit';

import featuresFeedComponentMapper from './featuresFeedComponentMapper';
import GET_FEED_FEATURES from './getFeedFeatures';

class FeaturesFeedConnected extends PureComponent {
  propTypes = {
    Component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object, // type check for React fragments
    ]),
    onPressActionItem: PropTypes.func,
  };

  loadingStateObject = {
    isLoading: true,
  };

  renderFeatures = ({ item }) =>
    featuresFeedComponentMapper({
      feature: item,
      onPressActionItem: this.props.onPressActionItem,
    });

  render() {
    const { Component, onPressActionItem, ...props } = this.props;
    return (
      <Query query={GET_FEED_FEATURES} fetchPolicy="cache-and-network">
        {({ error, data: features, loading }) => (
          <FeedView
            error={error}
            content={get(features, 'userFeedFeatures', [])}
            renderItem={this.renderFeatures}
            isLoading={loading && !get(features, 'userFeedFeatures', []).length}
            loadingStateObject={this.loadingStateObject}
            {...props}
          />
        )}
      </Query>
    );
  }
}

export default FeaturesFeedConnected;
