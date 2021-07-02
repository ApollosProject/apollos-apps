import React from 'react';
import PropTypes from 'prop-types';

import {
  AvatarList,
  Card,
  CardContent,
  ImageSourceType,
  styled,
  withIsLoading,
  withTheme,
  FeatureTitles,
} from '@apollosproject/ui-kit';

const AvatarWrapper = styled(
  {
    flexDirection: 'row',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  'ui-prayer.PrayerFeature.AvatarWrapper'
)(CardContent);

const getAvatars = (prayers) =>
  prayers.map((prayer) => ({
    id: prayer.id,
    notification: !prayer.isPrayed,
    profile: prayer.requestor,
  }));

const StyledAvatarList = withTheme(
  ({ isCard, theme }) => ({
    contentContainerStyle: {
      flexGrow: 1,
      paddingLeft: isCard ? theme.sizing.baseUnit * 1.5 : theme.sizing.baseUnit, // if this is a card render padding we would expect from `CardContent`
      paddingRight: isCard
        ? theme.sizing.baseUnit // equivalent `CardContent` padding the remaining `0.5 baseUnit` is the `padding` between `the renderItem`s. Total `1.5 baseUnit`
        : theme.sizing.baseUnit * 0.5, // the remaining `baseUnit * 0.5` is the `padding` between `the renderItem`s Total `1 baseUnit`
    },
  }),
  'ui-prayer.PrayerFeature.StyledAvatarList'
)(AvatarList);

const RenderAsCard = ({ children, isCard, isLoading }) =>
  isCard ? <Card isLoading={isLoading}>{children}</Card> : children;

RenderAsCard.propTypes = {
  isCard: PropTypes.bool,
  isLoading: PropTypes.bool,
  children: PropTypes.node,
};

const PrayerFeature = ({
  prayers,
  isCard,
  isLoading,
  onPressAdd,
  onPressAvatar,
  title,
  subtitle,
}) => (
  <RenderAsCard isCard={isCard} isLoading={isLoading}>
    {isLoading || title || subtitle ? ( // only display the Header if we are loading or have a title/subtitle
      <CardContent>
        <FeatureTitles
          isLoading={isLoading}
          title={title}
          subtitle={subtitle}
        />
      </CardContent>
    ) : null}
    <AvatarWrapper>
      <StyledAvatarList
        avatars={getAvatars(prayers)}
        isCard={isCard}
        isLoading={isLoading}
        onPressAdd={onPressAdd}
        onPressAvatar={onPressAvatar}
      />
    </AvatarWrapper>
  </RenderAsCard>
);

PrayerFeature.propTypes = {
  prayers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      isPrayed: PropTypes.bool,
      requestor: PropTypes.shape({
        photo: ImageSourceType,
      }),
    })
  ),
  isCard: PropTypes.bool,
  isLoading: PropTypes.bool,
  onPressAdd: PropTypes.func,
  onPressAvatar: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

PrayerFeature.defaultProps = {
  isCard: true,
  subtitle: 'Prayer',
  prayers: [],
};

export default withIsLoading(PrayerFeature);
