import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import TileImage from 'ui/TileImage';

const TileImageItem = ({
  item: { node: { id, title, coverImage: { sources } = {} } = {} } = {},
  navigation,
}) => (
  <View style={{ flex: 1, padding: 0 }}>
    <TileImage
      onPressItem={() =>
        navigation.navigate('ContentSingle', {
          itemId: id,
          itemTitle: title,
        })
      }
      key={id}
      text={title}
      image={sources[0].uri}
    />
  </View>
);

TileImageItem.propTypes = {
  item: PropTypes.shape({}),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default TileImageItem;
