import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  H3,
  H6,
  PaddedView,
  styled,
  withIsLoading,
} from '@apollosproject/ui-kit';

const Header = styled(
  ({ isCard, theme }) => ({
    ...(!isCard
      ? { paddingTop: theme.sizing.baseUnit * 3, paddingBottom: 0 }
      : {}),
  }),
  'ui-prayer.PrayerFeature.Header'
)(PaddedView);

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
