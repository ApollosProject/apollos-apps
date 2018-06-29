import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import ThumbnailCard from 'ui/ThumbnailCard';

const ThumbnailCardItem = ({
  item: { node: { id, title, coverImage: { sources } = {} } = {} } = {},
  navigation,
}) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
    }}
  >
    <ThumbnailCard
      onPressItem={() =>
        navigation.navigate('ContentSingle', {
          itemId: id,
          itemTitle: title,
        })
      }
      key={id}
      title={title}
      category={'Story'}
      images={sources[0].uri}
    />
  </View>
);

ThumbnailCardItem.propTypes = {
  item: PropTypes.shape({}),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default ThumbnailCardItem;
