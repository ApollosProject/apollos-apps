import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import TileImage from 'ui/TileImage';

const TileImageItem = ({
  item: { id, title, coverImage = {} } = {},
  isLoading,
  navigation,
}) => (
  <View style={{ flex: 1, padding: 10 }}>
    <TileImage
      onPressItem={() =>
        navigation.navigate('ContentSingle', {
          itemId: id,
          itemTitle: title,
        })
      }
      isLoading={isLoading}
      key={id}
      text={title}
      image={coverImage && coverImage.sources}
    />
  </View>
);

TileImageItem.propTypes = {
  item: PropTypes.shape({}),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  isLoading: PropTypes.bool,
};

export default TileImageItem;
