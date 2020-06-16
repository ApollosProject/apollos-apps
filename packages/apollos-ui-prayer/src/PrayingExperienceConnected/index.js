import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import ApollosConfig from '@apollosproject/config';
import { withTheme, ThemeMixin, ModalView } from '@apollosproject/ui-kit';
import { AnalyticsContext } from '@apollosproject/ui-analytics';

import PrayingExperience from './PrayingExperience';

export const GET_PRAYER_FEATURE = gql`
  query($id: ID!) {
    currentUser {
      id
      profile {
        id
        photo {
          uri
        }
      }
    }
    feature: node(id: $id) {
      ...PrayerListFeatureFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.PRAYER_LIST_FEATURE_FRAGMENT}
`;

const PrayingExperienceConnected = ({
  id,
  Component = PrayingExperience,
  AddPrayerComponent,
  OnboardingComponent,
  PrayingScreenComponent,
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

  const [isOnboarding, setIsOnboarding] = useState(true);

  const Wrapper = asModal ? ModalView : React.Fragment;

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
          PrayingScreenComponent={PrayingScreenComponent}
          OnboardingComponent={OnboardingComponent}
          primaryAvatar={photo}
          willShowOnboarding={showOnboarding}
          isOnboarding={isOnboarding}
          setIsOnboarding={setIsOnboarding}
          onFinish={onFinish}
          {...otherProps}
        />
      </Wrapper>
    </ThemeMixin>
  );
};

PrayingExperienceConnected.propTypes = {
  id: PropTypes.string.isRequired,
  Component: PropTypes.func,
  AddPrayerComponent: PropTypes.func,
  OnboardingComponent: PropTypes.func,
  PrayingScreenComponent: PropTypes.func,
  showOnboarding: PropTypes.bool,
  onFinish: PropTypes.func,
  themeType: PropTypes.string,
  asModal: PropTypes.bool,
  index: PropTypes.number,
};

export default withTheme(() => ({}), 'ui-prayer.PrayingExperienceConnected')(
  PrayingExperienceConnected
);
