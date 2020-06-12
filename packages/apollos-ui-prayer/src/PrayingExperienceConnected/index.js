import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

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
      # todo - this needs to be broken up into fragments
      ... on PrayerListFeature {
        prayers {
          id
          text
          requestor {
            id
            nickName
            firstName
            photo {
              uri
            }
          }
        }
      }
    }
  }
`;

const PRAY = gql`
  mutation($prayerId: ID!) {
    interactWithNode(action: PRAY, nodeId: $prayerId) {
      success
    }
  }
`;

const PrayingExperienceConnected = ({
  id,
  AddPrayerComponent = AddPrayerConnected,
  OnboardingComponent = PrayerOnboardingScreen,
  showOnboarding = true,
  onFinish,
}) => {
  const { loading, error, data } = useQuery(GET_PRAYER_FEATURE, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  // if (loading) return 'Loading...';
  // if (error) return `Error! ${error.message}`;

  const { prayers = [] } = data?.feature || {};
  const {
    currentUser: { profile: { photo = null } = {} },
  } = data || {};

  const [isOnboarding, setIsOnboarding] = useState(true);

  return (
    <>
      <PrayerSwiper>
        {({ swipeForward }) => (
          <React.Fragment>
            <AddPrayerComponent
              swipeForward={swipeForward}
              avatars={prayers.map((prayer) => prayer.requestor?.photo) || []}
              primaryAvatar={photo}
            />
            {prayers.map((prayer, prayerIndex) => (
              <PrayingScreen
                key={prayer.id}
                prayer={prayer}
                onPressPrimary={
                  prayerIndex < prayers.length - 1 ? swipeForward : onFinish
                }
              />
            ))}
          </React.Fragment>
        )}
      </PrayerSwiper>
      {showOnboarding ? ( // eslint-disable-line
        <OnboardingComponent
          avatars={prayers.map((prayer) => prayer.requestor?.photo) || []}
          primaryAvatar={photo}
          onPressPrimary={() => setIsOnboarding(false)}
          visibleOnMount
          visible={isOnboarding}
        />
      ) : null}
    </>
  );
};

PrayingExperienceConnected.propTypes = {
  id: PropTypes.string.isRequired,
  AddPrayerComponent: PropTypes.oneOfType([PropTypes.func]),
  OnboardingComponent: PropTypes.oneOfType([PropTypes.func]),
  showOnboarding: PropTypes.bool,
  onFinish: PropTypes.func,
};

export default PrayingExperienceConnected;
