import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AnalyticsContext } from '@apollosproject/ui-analytics';
import PrayerCard from '../PrayerCard';
import PrayerScreen from '../PrayerScreen';
import BackgroundImage from '../PrayerBlurBackground';
import AddedPrayerScreen from './AddedPrayerScreen';

export const ADD_PRAYER = gql`
  mutation($prayer: String!) {
    addPrayer(text: $prayer) {
      id
    }
  }
`;

export const GET_USER_PHOTO = gql`
  query {
    currentUser {
      id
      profile {
        id
        photo {
          uri
        }
      }
    }
  }
`;

const AddPrayerConnected = ({
  PrayerCardComponent = PrayerCard,
  title = 'Add your prayer',
  skipText = 'No thanks',
  primaryButtonText = 'Share prayer',
  swipeForward,
  avatars = [],
  AddedPrayerComponent = AddedPrayerScreen,
  ...screenProps
}) => {
  const { data: userData } = useQuery(GET_USER_PHOTO);
  const photo = userData?.currentUser?.profile?.photo;

  const { track } = useContext(AnalyticsContext);

  const [prayer, setPrayer] = useState('');

  const [addPrayer, { loading, data }] = useMutation(ADD_PRAYER, {
    onCompleted: () =>
      track({ eventName: 'PrayerAdded', properties: { prayer } }),
  });

  const completed = data?.addPrayer;

  return (
    <>
      <PrayerScreen
        secondaryActionText={skipText}
        onPressSecondary={swipeForward}
        primaryActionText={primaryButtonText}
        onPressPrimary={() => addPrayer({ variables: { prayer } })}
        buttonDisabled={loading || !prayer.length}
        isLoading={loading}
        background={<BackgroundImage source={photo || null} />}
        {...screenProps}
      >
        <PrayerCardComponent
          avatar={photo || null}
          title={title}
          onPrayerChangeText={setPrayer}
        />
      </PrayerScreen>
      {completed ? (
        <AddedPrayerComponent
          avatars={avatars}
          primaryAvatar={photo}
          onPressPrimary={swipeForward}
          visible
        />
      ) : null}
    </>
  );
};

AddPrayerConnected.propTypes = {
  PrayerCardComponent: PropTypes.func,
  title: PropTypes.string,
  swipeForward: PropTypes.func,
  skipText: PropTypes.string,
  primaryButtonText: PropTypes.string,
  avatars: PropTypes.arrayOf(PropTypes.shape({})),
  AddedPrayerComponent: PropTypes.func,
};

export default AddPrayerConnected;
