import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import { get } from 'lodash';

import { FeedView, named } from '@apollosproject/ui-kit';

import featuresFeedComponentMapper from './featuresFeedComponentMapper';
import GET_FEATURE_FEED from './getFeatureFeed';

export const ACTION_MAP = {
  READ_CONTENT: ({ navigation, relatedNode }) => {
    navigation.navigate('ContentSingle', {
      itemId: relatedNode.id,
      transitionKey: 2,
    });
  },
  READ_EVENT: ({ navigation, relatedNode }) => {
    navigation.navigate('Event', {
      eventId: relatedNode.id,
      transitionKey: 2,
    });
  },
  OPEN_NODE: ({ navigation, relatedNode }) => {
    // TODO deprecate
    console.warn('OPEN_NODE action deprecated, use READ_CONTENT');
    navigation.navigate('ContentSingle', {
      itemId: relatedNode.id,
      transitionKey: 2,
    });
  },
  OPEN_URL: ({ openUrl, relatedNode }) => {
    openUrl(relatedNode.url);
  },
  OPEN_AUTHENTICATED_URL: ({ openUrl, relatedNode }) => {
    openUrl(relatedNode.url, {}, { useRockToken: true });
  },
  OPEN_CHANNEL: ({ relatedNode, navigation }) => {
    navigation.navigate('ContentFeed', {
      itemId: relatedNode.id,
      itemTitle: relatedNode.name,
    });
  },
};

class FeaturesFeedConnected extends PureComponent {
  refetchFunctions = {};

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
      refetchRef: this.refetchRef,
      onPressActionItem: (args) =>
        this.props.onPressActionItem({ ...this.props, ...args }),
      additionalFeatures: this.props.additionalFeatures,
    });

  // eslint-disable-next-line
  refetchRef = ({ refetch, id }) => (this.refetchFunctions[id] = refetch);

  refetch = async () => {
    // refetch the feed
    const { data } = await this.refetchFunctions.feed();
    // get the ids of the current set of loaded features.

    const ids = get(data, 'node.features', []).map(({ id }) => id);

    return Promise.all(
      ids.map((id) => this.refetchFunctions[id] && this.refetchFunctions[id]())
    );
  };

  render() {
    const { onPressActionItem, featureFeedId, ...props } = this.props;
    // Early return if we don't have a featureFeedId.
    if (!featureFeedId) {
      return (
        <FeedView
          loadingStateData={this.loadingStateData}
          renderItem={this.renderFeatures}
          loading
          refetch={this.refetch}
          {...props}
        />
      );
    }
    return (
      <Query
        query={GET_FEATURE_FEED}
        variables={{ featureFeedId }}
        fetchPolicy="cache-and-network"
      >
        {({ error, data, loading, refetch }) => {
          const features = get(data, 'node.features', []);
          this.refetchRef({ refetch, id: 'feed' });
          return (
            <FeedView
              error={error}
              content={features}
              loadingStateData={this.loadingStateData}
              renderItem={this.renderFeatures}
              loading={loading}
              refetch={this.refetch}
              {...props}
            />
          );
        }}
      </Query>
    );
  }
}

FeaturesFeedConnected.propTypes = {
  featureFeedId: PropTypes.string,
  onPressActionItem: PropTypes.func,
  additionalFeatures: PropTypes.shape({}),
};

export default named('ui-connected.FeaturesFeedConnected')(
  FeaturesFeedConnected
);
