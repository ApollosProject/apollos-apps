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
  Icon,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';

import PrayerInput from '../PrayerInput';

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
    name: 'avatar',
    /* the icon sits in a containter with padding making it's size a touch smaller than it's
     * container size. This adjusts it to be roughly the same as `avatar.medium` */
    size: theme.sizing.avatar.medium * 1.25,
  }),
  'ui-prayer.PrayerCard.DefaultAvatar'
)(Icon);

const StyledCard = withTheme(
  ({ theme, cardColor }) => ({
    /* Unfortunately we have to jump through hoops and use a `cardColor` rather than just use
     * transparency due to a bug in android with the shadows 😭 We take `cardColor` and mix it with
     * `white` using the same level of `alpha` we would have used if transparency was an option. If
     * no cardColor is passed it uses the default color from the `Card` component.
     *
     * Additionally this component is exposes an override via `ui-prayer.PrayerCard.StyledCard` so
     * that, should you wish, you can change how these colors are mixed.
     */
    ...(cardColor
      ? {
          cardColor: Color(theme.colors.white)
            .mix(Color(cardColor), theme.alpha.high)
            .rgb()
            .string(),
        }
      : {}),
  }),
  'ui-prayer.PrayerCard.StyledCard'
)(Card);

const Content = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: move this style into `CardContent`
  paddingVertical: theme.sizing.baseUnit * 1.5, // TODO: move this style into `CardContent`
}))(CardContent);

const PrayerCard = ({ avatar, cardColor, prayer, title }) => (
  <StyledCard cardColor={cardColor}>
    <Content>
      <AvatarWrapper hasAvatar={!!avatar}>
        {avatar ? (
          <Avatar source={avatar} size={'medium'} />
        ) : (
          <DefaultAvatar />
        )}
      </AvatarWrapper>
      {prayer ? (
        <>
          <H4 padded>{title}</H4>
          <BodyText>{prayer}</BodyText>
        </>
      ) : (
        </* we render this without `padded` so that the input text can be aligned correctly */>
          <H4>{title}</H4>
          <PrayerInput />
        </>
      )}
    </Content>
  </StyledCard>
);

PrayerCard.propTypes = {
  avatar: PropTypes.shape({}),
  cardColor: PropTypes.string,
  title: PropTypes.string,
  prayer: PropTypes.string,
};

PrayerCard.defaultProps = {
  title: 'Add your prayer',
};

export default PrayerCard;
