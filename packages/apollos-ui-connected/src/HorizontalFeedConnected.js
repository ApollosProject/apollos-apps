import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';

import {
  HorizontalTileFeed,
  TouchableScale,
  named,
} from '@apollosproject/ui-kit';

import HorizontalContentCardConnected from './HorizontalContentCardConnected';

const HorizontalFeedConnected = ({
  isLoading,
  updateQuery,
  query,
  variables,
  mapContentFromData,
  Component,
}) => {
  const navigation = useNavigation();
  const { data, loading, error, fetchMore } = useQuery(query, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
  if (error) {
    return null;
  }
  if (isLoading || loading) {
    return (
      <Component
        isLoading
        loadingStateObject={{
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
        }}
        renderItem={() => <HorizontalContentCardConnected />}
        initialScrollIndex={0}
      />
    );
  }

  const { content, nextCursor, currentIndex } = mapContentFromData({
    data,
  });
  const initialScrollIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <Component
      content={content.map((item) => ({
        ...item,
        disabled: variables.nodeId
          ? item.id === variables.nodeId
          : item.id === variables.contentId,
      }))}
      renderItem={({ item }) => {
        const disabled = item?.node?.isLoading || item.disabled;

        return (
          <TouchableScale
            onPress={() =>
              navigation.push('ContentSingle', { itemId: item.id })
            }
            disabled={disabled}
          >
            <HorizontalContentCardConnected
              labelText={item?.node?.parentChannel?.name ?? ''}
              contentId={item?.id ?? ''}
              disabled={disabled}
              isLoading={item?.node?.isLoading}
              __typename={item?.__typename}
            />
          </TouchableScale>
        );
      }}
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
          variables: { cursor: nextCursor, ...variables },
          updateQuery,
        })
      }
    />
  );
};

HorizontalFeedConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  query: PropTypes.shape({}),
  variables: PropTypes.shape({
    nodeId: PropTypes.string,
    contentId: PropTypes.string,
  }),
  loadingStateObject: PropTypes.shape({}),
  mapContentFromData: PropTypes.func,
  updateQuery: PropTypes.func,
  isLoading: PropTypes.bool,
};

HorizontalFeedConnected.defaultProps = {
  Component: HorizontalTileFeed,
};

export default named('HorizontalFeedConnected')(HorizontalFeedConnected);
