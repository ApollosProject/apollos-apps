import React from 'react';
import { Button, View } from 'react-native';
import PropTypes from 'prop-types';
import { get, filter } from 'lodash';
import { H5 } from 'ui/typography';
import HorizontalTileFeed from 'ui/HorizontalTileFeed';
import ThumbnailCardItem from './thumbnailCardItem';

const TileContentFeed = ({
  loading,
  data,
  onRefresh,
  onEndReached,
  keyExtractor,
  onEndReachedThreshold,
  navigation,
  contentName,
  displayName,
}) => {
  const filteredData = get(data, 'contentChannels', [])
    .filter(
      ({ name }) =>
        name === 'Devotion Series' ||
        name === 'Sermon Series' ||
        name === 'Editorial'
    )
    .map(({ id, name, childContentItemsConnection }) => ({
      id,
      name,
      content: childContentItemsConnection.edges,
    }));

  const getIndividualContentFor = () =>
    filter(filteredData, {
      name: contentName,
    })[0];

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <H5>{displayName}</H5>
        <Button
          title={'View All'}
          onPress={() => {
            navigation.navigate('ContentFeed', {
              itemId: getIndividualContentFor().id,
              itemTitle: getIndividualContentFor().name,
            });
          }}
        />
      </View>
      <HorizontalTileFeed
        content={getIndividualContentFor().content}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <ThumbnailCardItem item={item} navigation={navigation} />
        )}
        loadingStateObject={{
          id: 'fake_id',
          title: '',
          sources: [],
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        onRefresh={onRefresh}
        refreshing={loading}
      />
    </View>
  );
};

TileContentFeed.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  contentName: PropTypes.string,
  displayName: PropTypes.string,
  loading: PropTypes.bool,
  data: PropTypes.shape({}),
  onRefresh: PropTypes.func,
  onEndReached: PropTypes.func,
  keyExtractor: PropTypes.func,
  onEndReachedThreshold: PropTypes.number,
};

export default TileContentFeed;
