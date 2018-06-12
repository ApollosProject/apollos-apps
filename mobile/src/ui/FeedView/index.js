import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { pure, compose, branch, withProps, defaultProps } from 'recompose';

import styled from 'ui/styled';
import FeedItemCard from 'ui/FeedItemCard';
import { enhancer as mediaQuery } from 'ui/MediaQuery';
import { ErrorCard } from 'ui/Card';

const StyledFlatList = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit / 4,
}))(FlatList);

// eslint-disable-next-line
const defaultFeedItemRenderer = ({ item }) => {
  if (!item) return null;
  return (
    // <Link to={item.link} component={TouchableWithoutFeedback}>
    <FeedItemCard
      id={item.id}
      title={item.title || item.name || ' '}
      channelType={item.channelType}
      images={item.coverImage}
      backgroundColor={item.theme.colors.background.paper}
      isLight={item.theme.isLight}
      isLoading={item.isLoading}
      isLiked={item.isLiked}
    />
    // </Link>
  );
};

const generateLoadingStateData = (numberOfItems = 1) => {
  const itemData = () => ({
    title: '',
    channelType: '',
    coverImage: [],
    theme: {
      isLight: '',
      colors: {
        background: {
          paper: '',
        },
      },
    },
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
    ListEmptyComponent,
    ...otherProps
  }) => (
    <StyledFlatList
      {...otherProps}
      renderItem={renderItem}
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
  )
);

FeedView.defaultProps = {
  isLoading: false,
  renderItem: defaultFeedItemRenderer,
  onEndReachedThreshold: 0.7,
  keyExtractor: (item) => item && (item.id || item.entryId),
  content: [],
  refetch: undefined,
  fetchMore: undefined,
};

FeedView.propTypes = {
  isLoading: PropTypes.bool,
  content: PropTypes.array, // eslint-disable-line
  refetch: PropTypes.func,
  fetchMore: PropTypes.func,
  renderItem: PropTypes.func,
  renderEmptyState: PropTypes.func,
  numColumns: PropTypes.number,
};

export { FeedView as default, defaultFeedItemRenderer };
