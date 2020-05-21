import React from 'react';
import PropTypes from 'prop-types';

import { H3, H6, PaddedView, styled } from '@apollosproject/ui-kit';

const Header = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 3,
  paddingBottom: 0,
}))(PaddedView);

/* TODO: Change to H5 and add appropriate padding. We are using H6 here to be consistant with other
 * "card titles" (`ActionListFeature`). */
const Title = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-prayer.PrayerFeature.Title'
)(H6);

const Subtitle = styled({}, 'ui-prayer.PrayerFeature.Subtitle')(H3);

const PrayerFeature = ({ isLoading, title, subtitle }) => (
  <>
    {isLoading || title || subtitle ? ( // only display the Header if we are loading or have a title/subtitle
      <Header>
        {isLoading || title ? ( // we check for isloading here so that they are included in the loading state
          <Title numberOfLines={1}>{title}</Title>
        ) : null}
        {isLoading || subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
      </Header>
    ) : null}
  </>
);

PrayerFeature.propTypes = {
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

PrayerFeature.defaultProps = {
  subtitle: 'Prayer',
};

export default PrayerFeature;
