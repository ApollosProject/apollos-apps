import React from 'react';
import { Button } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import PaddedView from 'ui/PaddedView';
import { H5 } from 'ui/typography';
import HorizontalTileFeed from 'ui/HorizontalTileFeed';
import styled from 'ui/styled';
import TileImageItem from './tileImageItem';

const RowHeader = styled({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 0,
})(PaddedView);

const TileContentFeed = ({
  isLoading,
  id,
  name,
  navigation,
  childContentItemsConnection = { edges: [] },
}) => (
  <PaddedView horizontal={false}>
    <RowHeader>
      <H5 isLoading={isLoading}>{name}</H5>
      {!isLoading ? (
        <Button
          title={'View All'}
          onPress={() => {
            navigation.navigate('ContentFeed', {
              itemId: id,
              itemTitle: name,
            });
          }}
        />
      ) : null}
    </RowHeader>
    <HorizontalTileFeed
      content={childContentItemsConnection.edges.map((item) => item.node)}
      renderItem={({ item }) => (
        <TileImageItem
          item={item}
          isLoading={isLoading}
          navigation={navigation}
        />
      )}
      loadingStateObject={{
        id: 'fake_id',
        title: '',
        coverImage: [],
      }}
      isLoading={isLoading}
      refreshing={isLoading}
    />
  </PaddedView>
);

TileContentFeed.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  isLoading: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  childContentItemsConnection: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.any, // this component doesn't care about the shape of `node`, just that it exists
      })
    ),
  }),
};

export default withNavigation(TileContentFeed);
