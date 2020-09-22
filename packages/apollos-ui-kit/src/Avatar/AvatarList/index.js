import React from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';

import { ImageSourceType } from '../../ConnectedImage';
import Icon from '../../Icon';
import styled from '../../styled';
import Touchable from '../../Touchable';
import { withTheme } from '../../theme';

import TouchableAvatar from './TouchableAvatar';

const AddIcon = withTheme(
  ({ theme }) => ({
    fill: theme.colors.white,
    name: 'plus',
    size: theme.sizing.avatar.medium * 0.475,
  }),
  'ui-kit.Avatar.AvatarList.AddIcon'
)(Icon);

const AddIconBackground = styled(
  ({ isLoading, theme }) => ({
    backgroundColor: isLoading
      ? theme.colors.background.inactive
      : theme.colors.action.primary,
    padding: theme.sizing.avatar.medium * 0.1625,
  }),
  'ui-kit.Avatar.AvatarList.AddIconBackground'
)(View);

const AndroidTouchableRippleFix = styled(
  ({ theme }) => ({
    borderRadius: theme.sizing.avatar.medium * 0.4,
    marginRight: theme.sizing.baseUnit * 0.5,
    overflow: 'hidden',
  }),
  'ui-kit.Avatar.AvatarList.AndroidTouchableRippleFix'
)(View);

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
  'ui-kit.Avatar.AvatarList.AvatarFeed'
)(FlatList);

// eslint-disable-next-line react/display-name, react/prop-types
const renderItem = (onPressAvatar, isLoading) => ({ item }) => (
  <TouchableAvatar
    disabled={isLoading || !onPressAvatar}
    /* eslint-disable-next-line */
    notification={item.notification}
    onPress={() => onPressAvatar({ item })}
    /* eslint-disable-next-line */
    source={item?.source}
  />
);

const renderListHeader = (onPressAdd, isLoading) =>
  onPressAdd ? (
    <AndroidTouchableRippleFix>
      <Touchable onPress={() => onPressAdd()} disabled={isLoading}>
        <AddIconBackground isLoading={isLoading}>
          <AddIcon isLoading={isLoading} />
        </AddIconBackground>
      </Touchable>
    </AndroidTouchableRippleFix>
  ) : null;

const AvatarList = ({
  avatars,
  isLoading,
  keyExtractor,
  onPressAdd,
  onPressAvatar,
  ...props
}) => (
  <AvatarFeed
    data={avatars}
    keyExtractor={keyExtractor}
    ListHeaderComponent={renderListHeader(onPressAdd, isLoading)}
    renderItem={renderItem(onPressAvatar, isLoading)}
    {...props}
  />
);

AvatarList.propTypes = {
  avatars: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      source: ImageSourceType,
      notification: PropTypes.bool,
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  keyExtractor: PropTypes.func,
  onPressAdd: PropTypes.func,
  onPressAvatar: PropTypes.func,
};

AvatarList.defaultProps = {
  keyExtractor: (item) => item && item.id,
};

export default AvatarList;
