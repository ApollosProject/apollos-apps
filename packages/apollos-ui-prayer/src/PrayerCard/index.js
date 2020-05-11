import React from 'react';
import { View } from 'react-native';
import Color from 'color';
import PropTypes from 'prop-types';

import {
  Avatar,
  BodyText,
  Card,
  CardContent,
  H4,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';

const AvatarWrapper = styled(({ theme }) => ({
  alignItems: 'center',
  paddingBottom: theme.sizing.baseUnit,
}))(View);

const StyledCard = withTheme(({ theme }) => ({
  cardColor: Color(theme.colors.white)
    .fade(theme.alpha.high)
    .rgb()
    .string(),
}))(Card);

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
      <H4 padded>{title}</H4>
      <BodyText>{prayer}</BodyText>
    </Content>
  </StyledCard>
);

PrayerCard.propTypes = {
  avatar: PropTypes.shape({}),
  title: PropTypes.string,
  prayer: PropTypes.string,
};

export default PrayerCard;
