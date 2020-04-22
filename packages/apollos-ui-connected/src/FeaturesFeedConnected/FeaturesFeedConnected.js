import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { FeedView } from '@apollosproject/ui-kit';

import featuresFeedComponentMapper from './featuresFeedComponentMapper';
import GET_FEED_FEATURES from './getFeedFeatures';

class FeaturesFeedConnected extends PureComponent {
  static propTypes = {
    Component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object, // type check for React fragments
    ]),
    onPressActionItem: PropTypes.func,
    additionalFeatures: PropTypes.shape({}),
  };

  loadingStateObject = [
    {
      isLoading: true,
      __typename: 'VerticalCardListFeature',
      isFeatured: true,
      id: 'feature1',
    },
    { isLoading: true, __typename: 'ActionListFeature', id: 'feature2' },
    {
      isLoading: true,
      __typename: 'HorizontalCardListFeature',
      id: 'feature3',
    },
    { isLoading: true, __typename: 'VerticalCardListFeature', id: 'feature4' },
  ];

  renderFeatures = ({ item }) =>
    featuresFeedComponentMapper({
      feature: item,
      onPressActionItem: this.props.onPressActionItem,
      additionalFeatures: this.props.additionalFeatures,
    });

  render() {
    const { Component, onPressActionItem, ...props } = this.props;
    return (
      <Query query={GET_FEED_FEATURES} fetchPolicy="cache-and-network">
        {({ error, data, loading }) => {
          const features = get(data, 'userFeedFeatures', []);
          const isLoading = loading && features.length === 0;
          return (
            <FeedView
              error={error}
              content={isLoading ? this.loadingStateObject : features}
              renderItem={this.renderFeatures}
              {...props}
            />
          );
        }}
      </Query>
    );
  }
}

export default FeaturesFeedConnected;
