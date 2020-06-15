import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import ApollosConfig from '@apollosproject/config';
import {
  ActivityIndicator,
  withTheme,
  ThemeMixin,
  ModalView,
} from '@apollosproject/ui-kit';

import PrayerSwiper from '../PrayerSwiper';
import AddPrayerConnected from '../AddPrayerConnected';
import PrayerOnboardingScreen from '../PrayerOnboardingScreen';
import PrayingScreen from './PrayingScreen';

const GET_PRAYER_FEATURE = gql`
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
  AddPrayerComponent = AddPrayerConnected,
  OnboardingComponent = PrayerOnboardingScreen,
  showOnboarding = true,
  onFinish,
  asModal,
  index,
  themeType = 'dark',
}) => {
  const { data, loading } = useQuery(GET_PRAYER_FEATURE, {
    variables: { id },
    partialRefetch: true,
    returnPartialData: true,
  });

  // if (loading) return 'Loading...';
  // if (error) return `Error! ${error.message}`;

  const { prayers = [] } = data?.feature || {};
  const photo = data?.currentUser?.profile?.photo;

  const [isOnboarding, setIsOnboarding] = useState(true);

  const Wrapper = asModal ? ModalView : React.Fragment;

  return (
    <ThemeMixin mixin={{ type: themeType }}>
      <Wrapper onClose={onFinish}>
        {loading && !prayers.length ? (
          <ActivityIndicator />
        ) : (
          <PrayerSwiper index={index}>
            {({ swipeForward }) => [
              <AddPrayerComponent
                key={'add-prayer'}
                swipeForward={!prayers.length ? onFinish : swipeForward}
                avatars={prayers.map((prayer) => prayer.requestor?.photo) || []}
                primaryAvatar={photo}
              />,
              ...prayers.map((prayer, prayerIndex) => (
                <PrayingScreen
                  key={prayer.id}
                  prayer={prayer}
                  onPressPrimary={
                    prayerIndex < prayers.length - 1 ? swipeForward : onFinish
                  }
                />
              )),
            ]}
          </PrayerSwiper>
        )}
      {showOnboarding ? ( // eslint-disable-line
          <OnboardingComponent
            avatars={prayers.map((prayer) => prayer.requestor?.photo) || []}
            primaryAvatar={photo}
            onPressPrimary={() => setIsOnboarding(false)}
            visibleOnMount
            visible={isOnboarding}
          />
        ) : null}
      </Wrapper>
    </ThemeMixin>
  );
};

PrayingExperienceConnected.propTypes = {
  id: PropTypes.string.isRequired,
  AddPrayerComponent: PropTypes.oneOfType([PropTypes.func]),
  OnboardingComponent: PropTypes.oneOfType([PropTypes.func]),
  showOnboarding: PropTypes.bool,
  onFinish: PropTypes.func,
  themeType: PropTypes.string,
  asModal: PropTypes.bool,
  index: PropTypes.number,
};

export default withTheme(() => ({}), 'ui-prayer.PrayingExperienceConnected')(
  PrayingExperienceConnected
);
