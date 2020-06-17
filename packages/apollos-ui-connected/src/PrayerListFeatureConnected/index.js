import React, { useState, useEffect } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import {
  PrayerFeature,
  PrayingExperienceConnected,
} from '@apollosproject/ui-prayer';
import { Modal, AsyncStorage } from 'react-native';
import GET_PRAYER_FEATURE from './getPrayerFeature';

function PrayerFeatureConnected({
  featureId,
  Component,
  isLoading,
  refetchRef,
  experienceProps,
  ...props
}) {
  const [modalOpened, setModalOpened] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const onboardingKey = `${featureId}-seenOnboarding`;

  useEffect(() => {
    (async () => {
      // TODO: we can un-comment this to enable onboarding being shown only once
      // const hasSeenOnboarding = await AsyncStorage.getItem(onboardingKey);
      // setShouldShowOnboarding(!hasSeenOnboarding);
      setShouldShowOnboarding(true);
    })();
  });

  const handleOpenTo = (index = 0) => {
    setSwiperIndex(index);
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
              {...props}
              isLoading={loading || isLoading}
            />
            <Modal
              animationType={'slide'}
              onRequestClose={() => setModalOpened(false)}
              visible={modalOpened}
            >
              <PrayingExperienceConnected
                index={swiperIndex}
                asModal
                onFinish={() => setModalOpened(false)}
                showOnboarding={shouldShowOnboarding}
                id={featureId}
                {...experienceProps}
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
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  refetchRef: PropTypes.func,
  experienceProps: PropTypes.shape({}),
};

PrayerFeatureConnected.defaultProps = {
  Component: PrayerFeature,
};

export default PrayerFeatureConnected;
