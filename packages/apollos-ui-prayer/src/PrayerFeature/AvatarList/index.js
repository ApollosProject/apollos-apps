import React from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';

import {
  ConnectedImage,
  Icon,
  ImageSourceType,
  styled,
  Touchable,
  withTheme,
} from '@apollosproject/ui-kit';

const AddIcon = withTheme(
  ({ theme }) => ({
    fill: theme.colors.white,
    name: 'plus',
    size: theme.sizing.avatar.medium * 0.475,
  }),
  'ui-prayer.PrayerFeature.AddIcon'
)(Icon);

const AddIconBackground = styled(({ theme }) => ({
  backgroundColor: theme.colors.action.primary,
  borderRadius: theme.sizing.avatar.medium * 0.4,
  padding: theme.sizing.avatar.medium * 0.1625,
  marginRight: theme.sizing.baseUnit * 0.5,
}))(View);

const Avatar = styled(({ theme }) => ({
  aspectRatio: 1,
  borderRadius: theme.sizing.avatar.medium * 0.4,
  height: theme.sizing.avatar.medium * 0.8,
  marginRight: theme.sizing.baseUnit * 0.5,
}))(ConnectedImage);

const AvatarFeed = withTheme(
  ({ theme }) => ({
    decelerationRate: 'fast', // passed down to rendered ScrollView
    horizontal: true,
    getItemLayout: (itemData, index) => ({
      length: theme.sizing.avatar.medium * 0.8 + theme.sizing.baseUnit * 0.5,
      offset:
        (theme.sizing.avatar.medium * 0.8 + theme.sizing.baseUnit * 0.5) *
        index,
      index,
    }),
    showsHorizontalScrollIndicator: false,
  }),
  'ui-prayer.PrayerFeature.AvatarList.AvatarFeed'
)(FlatList);

const keyExtractor = (item) => item && item.id;

const renderListHeader = ({ onPressAdd }) => (
  <Touchable onPress={() => onPressAdd()}>
    <AddIconBackground>
      <AddIcon />
    </AddIconBackground>
  </Touchable>
);

renderListHeader.propTypes = {
  onPressAdd: PropTypes.func,
};

// eslint-disable-next-line react/display-name, react/prop-types
const renderItem = (onPressAvatar) => ({ item }) => (
  <Touchable onPress={() => onPressAvatar()}>
    <Avatar source={item} />
  </Touchable>
);

const AvatarList = ({ avatars, onPressAdd, onPressAvatar, ...props }) => (
  <AvatarFeed
    data={avatars}
    keyExtractor={keyExtractor}
    ListHeaderComponent={renderListHeader({ onPressAdd })}
    renderItem={renderItem(onPressAvatar)}
    {...props}
  />
);

AvatarList.propTypes = {
  avatars: PropTypes.arrayOf(ImageSourceType),
  onPressAdd: PropTypes.func,
  onPressAvatar: PropTypes.func,
};

export default AvatarList;
