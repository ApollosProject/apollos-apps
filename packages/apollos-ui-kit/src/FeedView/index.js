import React, { Component } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { pure, compose, branch, withProps, defaultProps } from 'recompose';
import { get } from 'lodash';

import ContentCard from '../ContentCard';
import { enhancer as mediaQuery } from '../MediaQuery';
import { ErrorCard } from '../Card';
import TouchableScale from '../TouchableScale';

class FeedView extends Component {
  static propTypes = {
    content: PropTypes.array, // eslint-disable-line
    error: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
      PropTypes.object,
    ]),
    fetchMore: PropTypes.func,
    isLoading: PropTypes.bool,
    keyExtractor: PropTypes.func,
    ListEmptyComponent: PropTypes.func,
    ListItemComponent: PropTypes.any, // eslint-disable-line
    numColumns: PropTypes.number,
    onEndReachedThreshold: PropTypes.number,
    onPressItem: PropTypes.func,
    refetch: PropTypes.func,
    renderEmptyState: PropTypes.func,
    renderItem: PropTypes.func,
  };

  static defaultProps = {
    isLoading: false,
    ListItemComponent: ContentCard,
    onEndReachedThreshold: 0.7,
    keyExtractor: (item) => item && item.id,
    content: [],
    refetch: undefined,
    fetchMore: undefined,
  };

  refetchHandler = ({ isLoading, refetch }) =>
    refetch && ((...args) => !isLoading && refetch(...args));

  fetchMoreHandler = ({ fetchMore, error, isLoading }) =>
    fetchMore && ((...args) => !isLoading && !error && fetchMore(...args));

  renderItem = ({ item }) => {
    if (this.props.renderItem) {
      return this.props.renderItem({ item });
    }
    const Item = this.props.ListItemComponent;
    return (
      // These are all props of FeedItemCard but they do not have data coming
      // back yet. So I moved them here for safe keeping.
      // TODO: Move them back when the data is ready.
      <TouchableScale onPress={() => this.props.onPressItem({ ...item })}>
        <Item
          {...item}
          contentId={item.isLoading ? null : get(item, 'id')}
          isLoading={item.isLoading}
        />
      </TouchableScale>
    );
  };

  render() {
    const {
      content,
      error,
      fetchMore,
      isLoading,
      keyExtractor,
      ListItemComponent,
      ListEmptyComponent,
      numColumns,
      onEndReachedThreshold,
      refetch,
      renderEmptyState,
      renderItem,
      ...otherProps
    } = this.props;
    return (
      <FlatList
        {...otherProps}
        data={content}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          error && !isLoading && (!content || !content.length)
            ? console.warn(error) || <ErrorCard error={error} />
            : ListEmptyComponent
        }
        numColumns={numColumns}
        onEndReached={this.fetchMoreHandler({ fetchMore, error, isLoading })}
        onEndReachedThreshold={onEndReachedThreshold}
        onRefresh={this.refetchHandler({ isLoading, refetch })}
        refreshing={isLoading}
        renderItem={this.renderItem}
      />
    );
  }
}

const defaultLoadingState = {
  id: 'fakeId0',
  isLoading: true,
  title: '',
  channelType: '',
  coverImage: [],
  parentChannel: {
    id: '',
    name: '',
  },
};

const generateLoadingStateData = (
  numberOfItems = 1,
  loadingStateObject = defaultLoadingState
) => {
  const itemData = () => ({ ...loadingStateObject });

  const loadingStateData = [];

  while (loadingStateData.length < numberOfItems) {
    const newData = itemData();
    newData.id = `fakeId${loadingStateData.length}`;
    loadingStateData.push(newData);
  }

  return loadingStateData;
};

const enhance = compose(
  pure,
  branch(
    ({ isLoading, content }) => isLoading && !content.length,
    withProps(({ loadingStateObject, loadingStateData }) => ({
      isLoading: true,
      content:
        loadingStateData || generateLoadingStateData(10, loadingStateObject),
      fetchMore: () => {},
    }))
  ),
  mediaQuery(
    ({ md }) => ({ maxWidth: md }),
    defaultProps({ numColumns: 1 }),
    defaultProps({ numColumns: 2 })
  )
);

export default enhance(FeedView);
