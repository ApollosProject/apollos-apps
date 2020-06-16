import React from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';

import Avatar from '../Avatar';
import { ImageSourceType } from '../../ConnectedImage';
import Icon from '../../Icon';
import styled from '../../styled';
import Touchable from '../../Touchable';
import { withTheme } from '../../theme';

const AddIcon = withTheme(
  ({ theme }) => ({
    fill: theme.colors.white,
    name: 'plus',
    size: theme.sizing.avatar.medium * 0.475,
  }),
  'ui-kit.AvatarList.AddIcon'
)(Icon);

const AddIconBackground = styled(
  ({ isLoading, theme }) => ({
    backgroundColor: isLoading
      ? theme.colors.background.inactive
      : theme.colors.action.primary,
    padding: theme.sizing.avatar.medium * 0.1625,
  }),
  'ui-kit.AvatarList.AddIconBackground'
)(View);

const AndroidTouchableRippleFix = styled(
  ({ theme }) => ({
    borderRadius: theme.sizing.avatar.medium * 0.4,
    marginRight: theme.sizing.baseUnit * 0.5,
    overflow: 'hidden',
  }),
  'ui-kit.AvatarList.AndroidTouchableRippleFix'
)(View);

const StyledAvatar = withTheme(
  ({ theme }) => ({
    themeSize: theme.sizing.avatar.medium * 0.8,
  }),
  'ui-kit.AvatarList.StyledAvatar'
)(Avatar);

const AvatarFeed = withTheme(
  ({ theme }) => ({
    // contentContainerStyle: { alignItems: 'center' },
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
  'ui-kit.AvatarList.AvatarFeed'
)(FlatList);

// eslint-disable-next-line react/display-name, react/prop-types
const renderItem = (onPressAvatar, isLoading) => ({ item }) => (
  <AndroidTouchableRippleFix>
    <Touchable
      disabled={isLoading || !onPressAvatar}
      onPress={() => onPressAvatar({ item })}
      useForeground
    >
      <View /* Fixes Android throwing an error about the child of a Touchable 🙃 */
      >
        <StyledAvatar source={item?.source} notification={item.notification} />
      </View>
    </Touchable>
  </AndroidTouchableRippleFix>
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
