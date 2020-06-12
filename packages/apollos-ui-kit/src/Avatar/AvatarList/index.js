import React from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';

import Icon from '../../Icon';
import styled from '../../styled';
import Touchable from '../../Touchable';
import { withTheme } from '../../theme';
import CoreAvatar from '../Avatar';

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
    borderRadius: theme.sizing.avatar.medium * 0.4,
    padding: theme.sizing.avatar.medium * 0.1625,
    marginRight: theme.sizing.baseUnit * 0.5,
  }),
  'ui-kit.AvatarList.AddIconBackground'
)(View);

const Avatar = withTheme(
  ({ theme }) => ({
    themeSize: theme.sizing.avatar.medium * 0.8,
    containerStyle: {
      marginRight: theme.sizing.baseUnit * 0.5,
    },
  }),
  'ui-kit.AvatarList.Avatar'
)(CoreAvatar);

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
  'ui-kit.AvatarList.AvatarFeed'
)(FlatList);

// eslint-disable-next-line react/display-name, react/prop-types
const renderItem = (onPressAvatar, isLoading) => ({ item }) => (
  <Touchable
    onPress={() => onPressAvatar({ item })}
    disabled={isLoading || !onPressAvatar}
  >
    <Avatar source={item} isLoading={isLoading} unread={item.unread} />
  </Touchable>
);

const renderListHeader = (onPressAdd, isLoading) =>
  onPressAdd ? (
    <Touchable onPress={() => onPressAdd()} disabled={isLoading}>
      <AddIconBackground isLoading={isLoading}>
        <AddIcon isLoading={isLoading} />
      </AddIconBackground>
    </Touchable>
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
      uri: PropTypes.string,
      unread: PropTypes.bool,
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
