import React from 'react';
import { View } from 'react-native';
import Color from 'color';
import PropTypes from 'prop-types';

import {
  Avatar,
  Card,
  CardContent,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';

import PrayerContent from './PrayerContent';

const AvatarWrapper = styled(
  ({ theme }) => ({
    alignItems: 'center',
    paddingBottom: theme.sizing.baseUnit,
  }),
  'ui-prayer.PrayerCard.AvatarWrapper'
)(View);

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
      <AvatarWrapper>
        <Avatar source={avatar} size={'medium'} />
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
