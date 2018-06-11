import React from 'react';
import { TouchableWithoutFeedback, Link } from 'react-native';
import PropTypes from 'prop-types';
import { pure, compose, branch, withProps, defaultProps } from 'recompose';
import { get } from 'lodash';

import FeedItemCard from 'ui/FeedItemCard';
import { enhancer as mediaQuery } from 'ui/MediaQuery';
import { ErrorCard } from 'ui/Card';
import FeedList from './FeedList';

const defaultFeedItemRenderer = (
  CardComponent = FeedItemCard,
  LinkComponent = Link
  // eslint-disable-next-line
) => ({ item }) => {
  if (!item) return null;
  return (
    <LinkComponent to={item.link} component={TouchableWithoutFeedback}>
      <CardComponent
        id={item.id}
        title={item.title || item.name || ' '}
        category={item.category}
        images={item.coverImage}
        backgroundColor={item.theme.colors.background.paper}
        isLight={item.theme.isLight}
        isLoading={item.isLoading}
        isLiked={item.isLiked || get(item, 'content.isLiked', false)}
      />
    </LinkComponent>
  );
};

const generateLoadingStateData = (numberOfItems = 1) => {
  const itemData = () => ({
    title: '',
    category: '',
    coverImage: [],
    theme: {},
    isLoading: true,
    id: 'fakeId0',
  });

  const loadingStateData = [itemData()];

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
    withProps({
      isLoading: true,
      content: generateLoadingStateData(10),
      fetchMore: false,
    })
  ),
  mediaQuery(
    ({ md }) => ({ maxWidth: md }),
    defaultProps({ numColumns: 1 }),
    defaultProps({ numColumns: 2 })
  )
);

const refetchHandler = ({ isLoading, refetch }) =>
  refetch && ((...args) => !isLoading && refetch(...args));

const fetchMoreHandler = ({ fetchMore, error, isLoading }) =>
  fetchMore && ((...args) => !isLoading && !error && fetchMore(...args));

const FeedView = enhance(
  ({
    isLoading,
    refetch,
    content,
    error,
    fetchMore,
    numColumns,
    renderItem,
    ItemComponent,
    ListEmptyComponent,
    ...otherProps
  }) => {
    let itemRenderer = renderItem;
    if (!itemRenderer) {
      itemRenderer = defaultFeedItemRenderer(ItemComponent);
    }
    return (
      <FeedList
        {...otherProps}
        renderItem={itemRenderer}
        refreshing={isLoading}
        onRefresh={refetchHandler({ isLoading, refetch })}
        onEndReached={fetchMoreHandler({ fetchMore, error, isLoading })}
        numColumns={numColumns}
        data={content}
        ListEmptyComponent={
          error && !isLoading && (!content || !content.length) ? (
            <ErrorCard error={error} />
          ) : (
            ListEmptyComponent
          )
        }
      />
    );
  }
);

FeedView.defaultProps = {
  isLoading: false,
  onEndReachedThreshold: 0.7,
  keyExtractor: (item) => item && (item.id || item.entryId),
  content: [],
  refetch: undefined,
  fetchMore: undefined,
  ItemComponent: FeedItemCard,
};

FeedView.propTypes = {
  isLoading: PropTypes.bool,
  content: PropTypes.array, // eslint-disable-line
  refetch: PropTypes.func,
  fetchMore: PropTypes.func,
  renderItem: PropTypes.func,
  renderEmptyState: PropTypes.func,
  numColumns: PropTypes.number,
  ItemComponent: PropTypes.any, // eslint-disable-line
};

export { FeedView as default, defaultFeedItemRenderer };
