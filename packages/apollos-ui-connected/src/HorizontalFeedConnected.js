import React, { Component } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { withNavigation } from '@react-navigation/compat';
import { Query } from '@apollo/client/react/components';

import { HorizontalTileFeed, TouchableScale } from '@apollosproject/ui-kit';

import HorizontalContentCardConnected from './HorizontalContentCardConnected';

const loadingStateObject = {
  node: {
    id: 'fakeId0',
    title: '',
    coverImage: '',
    isLoading: true,
    parentChannel: {
      name: '',
    },
    // We need to assume a typename so HorizontalContentCardConnected knows what "type" to render
    __typename: 'MediaContentItem',
  },
};

class HorizontalFeedConnected extends Component {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    Component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object, // type check for React fragments
    ]),
    navigation: PropTypes.shape({
      push: PropTypes.func,
    }),
    query: PropTypes.shape({}),
    renderItem: PropTypes.func,
    variables: PropTypes.shape({}),
    loadingStateObject: PropTypes.shape({}),
    isItemDisabled: PropTypes.func,
    mapContentFromData: PropTypes.func,
    updateQuery: PropTypes.func,
    onPressItem: PropTypes.func,
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    Component: HorizontalTileFeed,
  };

  renderItem = ({ item }) => {
    const disabled =
      this.props.isItemDisabled && this.props.isItemDisabled({ item });
    const isLoading = get(item.node, 'isLoading');

    const onPressItem = this.props.onPressItem || this.handleOnPressItem;

    return (
      <TouchableScale
        onPress={() => onPressItem(item)}
        disabled={isLoading || disabled}
      >
        <HorizontalContentCardConnected
          labelText={get(item.node, 'parentChannel.name', null)}
          contentId={get(item, 'id', '')}
          disabled={disabled}
          isLoading={isLoading}
          __typename={get(item, '__typename')}
        />
      </TouchableScale>
    );
  };

  handleOnPressItem = (item) => {
    this.props.navigation.push('ContentSingle', {
      itemId: item.id,
    });
  };

  renderFeed = ({ data, loading, error, fetchMore }) => {
    if (error) return null;

    const { content, nextCursor, currentIndex } = this.props.mapContentFromData(
      {
        data,
      }
    );
    const initialScrollIndex = currentIndex === -1 ? 0 : currentIndex;

    const { Component: FeedComponent } = this.props;

    return (
      <FeedComponent
        isLoading={loading}
        content={content}
        loadingStateObject={this.props.loadingStateObject || loadingStateObject}
        renderItem={this.props.renderItem || this.renderItem}
        initialScrollIndex={initialScrollIndex}
        getItemLayout={(itemData, index) => ({
          // We need to pass this function so that initialScrollIndex will work.
          length: 240,
          offset: 240 * index,
          index,
        })}
        onEndReached={() =>
          !loading &&
          fetchMore({
            variables: { cursor: nextCursor, ...this.props.variables },
            updateQuery: this.props.updateQuery,
          })
        }
      />
    );
  };

  render() {
    if (this.props.isLoading) return this.renderFeed({ loading: true });

    return (
      <Query
        query={this.props.query}
        variables={this.props.variables}
        fetchPolicy={'cache-and-network'}
        notifyOnNetworkStatusChange
      >
        {this.renderFeed}
      </Query>
    );
  }
}

export default withNavigation(HorizontalFeedConnected);
