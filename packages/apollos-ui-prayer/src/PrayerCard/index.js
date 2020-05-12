import React from 'react';
import { View } from 'react-native';
import Color from 'color';
import PropTypes from 'prop-types';

import {
  Avatar,
  Card,
  CardContent,
  Icon,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';

import PrayerContent from './PrayerContent';

const AvatarWrapper = styled(
  ({ hasAvatar, theme }) => ({
    alignItems: 'center',
    /* `DefaultAvatar` has some padding built into the icon so we don't need this if we don't have a
     * users `avatar` */
    paddingBottom: hasAvatar ? theme.sizing.baseUnit : 0,
  }),
  'ui-prayer.PrayerCard.AvatarWrapper'
)(View);

const DefaultAvatar = withTheme(
  ({ theme }) => ({
    /* the icon sits in a containter with padding making it's size a touch smaller than it's
     * container size. This adjusts it to be roughly the same as `avatar.medium` */
    size: theme.sizing.avatar.medium * 1.25,
    name: 'avatar',
  }),
  'ui-prayer.PrayerCard.DefaultAvatar'
)(Icon);

const StyledCard = withTheme(
  ({ theme }) => ({
    cardColor: Color(theme.colors.white)
      .fade(theme.alpha.high)
      .rgb()
      .string(),
  }),
  'ui-prayer.PrayerCard.StyledCard'
)(Card);

const Content = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit * 1.5, // TODO: move this style into `CardContent`
  paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: move this style into `CardContent`
}))(CardContent);

const PrayerCard = ({ avatar, prayer, title }) => (
  <StyledCard>
    <Content>
      <AvatarWrapper hasAvatar={!!avatar}>
        {avatar ? (
          <Avatar source={avatar} size={'medium'} />
        ) : (
          <DefaultAvatar />
        )}
      </AvatarWrapper>
      <PrayerContent title={title} prayer={prayer} />
    </Content>
  </StyledCard>
);

PrayerCard.propTypes = {
  avatar: PropTypes.shape({}),
  title: PropTypes.string,
  prayer: PropTypes.string,
};

export default PrayerCard;
