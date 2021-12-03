import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
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
    // TODO deprecate
    console.warn('READ_EVENT action deprecated, use READ_CONTENT');
    navigation.navigate('ContentSingle', {
      itemId: relatedNode.id,
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
  OPEN_FEED: ({ relatedNode, navigation, title }) => {
    navigation.navigate('FeatureFeed', {
      id: relatedNode.id,
      title,
    });
  },
};

const handleOnPress = ({ action, ...args }) => {
  if (ACTION_MAP[action]) {
    ACTION_MAP[action]({ action, ...args });
  }
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

  renderFeatures = ({ item }) => {
    const { openUrl, navigation } = this.props;
    return featuresFeedComponentMapper({
      feature: item,
      refetchRef: this.refetchRef,
      onPressActionItem: (feature) =>
        this.props.onPressActionItem({
          openUrl,
          navigation,
          ...feature,
        }),
      additionalFeatures: this.props.additionalFeatures,
    });
  };

  refetchRef = ({ refetch, id }) => {
    this.refetchFunctions[id] = refetch;
  };

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
    const featureFeedId =
      this.props.route?.params.id || this.props.featureFeedId;
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
            />
          );
        }}
      </Query>
    );
  }
}

FeaturesFeedConnected.propTypes = {
  featureFeedId: PropTypes.string.isRequired,
  onPressActionItem: PropTypes.func,
  openUrl: PropTypes.func,
  additionalFeatures: PropTypes.shape({}),
  route: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }),
};

FeaturesFeedConnected.defaultProps = {
  onPressActionItem: handleOnPress,
  openUrl: Linking.openURL,
};

export default named('ui-connected.FeaturesFeedConnected')(
  FeaturesFeedConnected
);
