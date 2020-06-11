import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Animated, StyleSheet } from 'react-native';

import {
  AvatarCloud,
  H3,
  BodyText,
  PaddedView,
  BackgroundView,
} from '@apollosproject/ui-kit';

import PrayerCard from '../PrayerCard';
import PrayerScreen from '../PrayerScreen';
import PrayerSwiper from '../PrayerSwiper';

import AddPrayerConnected from '../AddPrayerConnected';

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

const PrayingExperienceConnected = ({
  id,
  AddPrayerComponent = AddPrayerConnected,
  showOnboarding = true,
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

  return (
    <>
      <PrayerSwiper>
        {() => (
          <React.Fragment>
            {React.isValidElement(AddPrayerComponent) ? (
              AddPrayerComponent
            ) : (
              <AddPrayerComponent />
            )}
            {prayers.map((prayer) => (
              <PrayerScreen key={prayer.id}>
                <PrayerCard
                  prayer={prayer.text}
                  avatar={prayer.requestor?.photo || null}
                  title={`Pray for ${prayer.requestor?.nickName ||
                    prayer.requestor?.firstName}`}
                />
              </PrayerScreen>
            ))}
          </React.Fragment>
        )}
      </PrayerSwiper>
      {showOnboarding ? (
        <Animated.View style={[StyleSheet.absoluteFill]}>
          <BackgroundView>
            <PrayerScreen primaryActionText="Next" onPressSecondary={() => {}}>
              <AvatarCloud
                maxAvatarWidth={0.4}
                primaryAvatar={photo}
                avatars={prayers.map(
                  (prayer) => prayer.requestor?.photo || null
                )}
              />
              <PaddedView style={{ flexGrow: 1, alignItems: 'center' }}>
                <H3 style={{ textAlign: 'center' }}>Join us today in prayer</H3>
                <PaddedView>
                  <BodyText style={{ textAlign: 'center' }}>
                    This is the confidence we have in approaching God: that if
                    we ask anything according to his will, he hears us.
                  </BodyText>
                  <BodyText style={{ textAlign: 'center' }}>
                    1 John 5:14
                  </BodyText>
                </PaddedView>
              </PaddedView>
            </PrayerScreen>
          </BackgroundView>
        </Animated.View>
      ) : null}
    </>
  );
};

PrayingExperienceConnected.propTypes = {
  id: PropTypes.string.isRequired,
  AddPrayerComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  showOnboarding: PropTypes.bool,
};

export default PrayingExperienceConnected;
