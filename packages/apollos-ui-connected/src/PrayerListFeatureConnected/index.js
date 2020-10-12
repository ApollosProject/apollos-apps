import React, { useState, useEffect } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import {
  PrayerFeature,
  PrayerExperienceConnected,
} from '@apollosproject/ui-prayer';
import { Modal } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import GET_PRAYER_FEATURE from './getPrayerFeature';

function PrayerFeatureConnected({
  featureId,
  Component,
  isLoading,
  refetchRef,
  PrayerExperienceComponent,
  ...props
}) {
  const [modalOpened, setModalOpened] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(0);
  // returns current state value and function to update; inital state set for first render
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  // what is default/inital state of onboardingKey??
  const onboardingKey = `${featureId}-seenOnboarding`;

  // like componentDidMount, componentDidUpdate
  useEffect(() => {
    (async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem(onboardingKey);
      setShouldShowOnboarding(!hasSeenOnboarding);
    })();
  // passing an empty array so no dependencies specified when the effect should execute
  },[]);

  const handleOpenTo = (index = 0) => {
    setSwiperIndex(index);
    // if (AsyncStorage.getItem(onboardingKey) === 'NO') {
    //   return shouldShowOnboarding
    // }
    // else
    AsyncStorage.setItem(onboardingKey, 'YES');
    setModalOpened(true);
  };

  return (
    <Query
      query={GET_PRAYER_FEATURE}
      variables={{ featureId }}
      fetchPolicy="cache-and-network"
    >
      {({ data, loading, refetch }) => {
        if (featureId && refetch && refetchRef)
          refetchRef({ refetch, id: featureId });

        const handleOnFinish = () => {
          const prayers = data?.node?.prayers || [];
          const allPrayed = !prayers.find((prayer) => !prayer.isPrayed);
          if (allPrayed) refetch();
          setModalOpened(false);
        };

        return (
          <>
            <Component
              onPressAdd={handleOpenTo}
              onPressAvatar={({ item }) =>
                handleOpenTo(
                  1 + // first item in list is add prayer
                    data?.node?.prayers?.findIndex(
                      (prayer) => prayer.id === item.id
                    )
                )
              }
              prayers={data?.node?.prayers}
              subtitle={data?.node?.subtitle}
              title={data?.node?.title}
              isCard={data?.node?.isCard}
              isLoading={loading || isLoading}
              {...props}
            />
            <Modal
              animationType={'slide'}
              onRequestClose={() => setModalOpened(false)}
              visible={modalOpened}
            >
              <PrayerExperienceComponent
                index={swiperIndex}
                asModal
                onFinish={handleOnFinish}
                showOnboarding={shouldShowOnboarding}
                id={featureId}
              />
            </Modal>
          </>
        );
      }}
    </Query>
  );
}

PrayerFeatureConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  PrayerExperienceComponent: PropTypes.func,
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  refetchRef: PropTypes.func,
};

PrayerFeatureConnected.defaultProps = {
  Component: PrayerFeature,
  PrayerExperienceComponent: PrayerExperienceConnected,
};

export default PrayerFeatureConnected;
