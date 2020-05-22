import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardContent,
  H3,
  H6,
  styled,
  withIsLoading,
} from '@apollosproject/ui-kit';

import AvatarList from './AvatarList';

const AvatarWrapper = styled(
  ({ theme }) => ({
    flexDirection: 'row',
    paddingBottom: theme.sizing.baseUnit * 2, // TODO: refactor CardContent to have this be the default
    paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
    paddingRight: 0,
    /* Because `CardContent` is passing `paddingVertical` to `PaddedView` we can't set
     * `PaddedView`'s `vertical` prop to false. So we have to define out own padding value here. */
    paddingTop: theme.sizing.baseUnit,
  }),
  'ui-prayer.PrayerFeature.AvatarWrapper'
)(CardContent);

const Header = styled(
  ({ isCard, theme }) => ({
    ...(!isCard
      ? {
          paddingTop: theme.sizing.baseUnit * 3, //
        }
      : {
          paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
        }),
    /* Because `CardContent` is passing `paddingVertical` to `PaddedView` we can't set
     * `PaddedView`'s `vertical` prop to false. So we have to define out own padding value here. */
    paddingBottom: 0,
  }),
  'ui-prayer.PrayerFeature.Header'
)(CardContent);

/* TODO: Change to H5 and add appropriate padding. We are using H6 here to be consistant with other
 * "card titles" (`ActionListFeature`). */
const Title = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-prayer.PrayerFeature.Title'
)(H6);

const Subtitle = styled({}, 'ui-prayer.PrayerFeature.Subtitle')(H3);

const RenderAsCard = ({ children, isCard, isLoading }) =>
  isCard ? <Card isLoading={isLoading}>{children}</Card> : children;

RenderAsCard.propTypes = {
  isCard: PropTypes.bool,
  isLoading: PropTypes.bool,
  children: PropTypes.node,
};

const PrayerFeature = ({ isCard, isLoading, title, subtitle }) => (
  <RenderAsCard isCard={isCard} isLoading={isLoading}>
    {isLoading || title || subtitle ? ( // only display the Header if we are loading or have a title/subtitle
      <Header isCard={isCard}>
        {isLoading || title ? ( // we check for isloading here so that they are included in the loading state
          <Title numberOfLines={1}>{title}</Title>
        ) : null}
        {isLoading || subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
      </Header>
    ) : null}
    <AvatarWrapper>
      <AvatarList
        avatars={[
          'https://picsum.photos/200',
          'https://picsum.photos/200',
          'https://picsum.photos/200',
          'https://picsum.photos/200',
          'https://picsum.photos/200',
          'https://picsum.photos/200',
        ]}
      />
    </AvatarWrapper>
  </RenderAsCard>
);

PrayerFeature.propTypes = {
  isCard: PropTypes.bool,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

PrayerFeature.defaultProps = {
  isCard: true,
  subtitle: 'Prayer',
};

export default withIsLoading(PrayerFeature);
