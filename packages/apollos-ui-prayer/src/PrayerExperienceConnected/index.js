import React, { useContext } from 'react';
import { StatusBar, View } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { withTheme, ThemeMixin, ModalView } from '@apollosproject/ui-kit';
import { AnalyticsContext } from '@apollosproject/ui-analytics';

import PrayerExperience from './PrayerExperience';

import GET_PRAYER_FEATURE from './getPrayerFeature';

const PrayerExperienceConnected = ({
  id,
  Component = PrayerExperience,
  AddPrayerComponent,
  OnboardingComponent,
  PrayerScreenComponent,
  showOnboarding = true,
  onFinish,
  asModal,
  index,
  themeType = 'dark',
  ...otherProps
}) => {
  const { data, loading } = useQuery(GET_PRAYER_FEATURE, {
    variables: { id },
    partialRefetch: true,
    returnPartialData: true,
  });
  const { track } = useContext(AnalyticsContext);

  // if (loading) return 'Loading...';
  // if (error) return `Error! ${error.message}`;

  const { prayers = [] } = data?.feature || {};
  const photo = data?.currentUser?.profile?.photo;

  const Wrapper = asModal ? ModalView : View;

  const handleFinish = () => {
    track({ eventName: 'PrayerClosed' });
    return onFinish && onFinish();
  };

  return (
    <ThemeMixin mixin={{ type: themeType }}>
      <Wrapper onClose={handleFinish}>
        <Component
          index={index}
          loading={loading}
          prayers={prayers}
          track={track}
          AddPrayerComponent={AddPrayerComponent}
          PrayerScreenComponent={PrayerScreenComponent}
          OnboardingComponent={OnboardingComponent}
          primaryAvatar={photo}
          willShowOnboarding={showOnboarding}
          onFinish={onFinish}
          {...otherProps}
        />
        <StatusBar hidden />
      </Wrapper>
    </ThemeMixin>
  );
};

PrayerExperienceConnected.propTypes = {
  id: PropTypes.string.isRequired,
  Component: PropTypes.func,
  AddPrayerComponent: PropTypes.func,
  OnboardingComponent: PropTypes.func,
  PrayerScreenComponent: PropTypes.func,
  showOnboarding: PropTypes.bool,
  onFinish: PropTypes.func,
  themeType: PropTypes.string,
  asModal: PropTypes.bool,
  index: PropTypes.number,
};

export default withTheme(
  () => ({}),
  'ui-prayer.PrayerExperienceConnected'
)(PrayerExperienceConnected);
