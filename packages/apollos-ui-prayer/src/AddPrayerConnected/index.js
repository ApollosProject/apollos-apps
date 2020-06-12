import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PrayerCard from '../PrayerCard';
import PrayerScreen from '../PrayerScreen';
import BackgroundImage from '../PrayerBlurBackground';
import AddedPrayerScreen from './AddedPrayerScreen';

const ADD_PRAYER = gql`
  mutation($prayer: String!) {
    addPrayer(text: $prayer) {
      id
    }
  }
`;

const GET_USER_PHOTO = gql`
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
  title = 'Add your prayer',
  skipText = 'No thanks',
  primaryButtonText = 'Share prayer',
  swipeForward,
  avatars = [],
  AddedPrayerComponent = AddedPrayerScreen,
}) => {
  const { data: userData } = useQuery(GET_USER_PHOTO);
  const {
    currentUser: { profile: { photo = null } = {} },
  } = userData || {};

  const [addPrayer, { loading, data }] = useMutation(ADD_PRAYER);
  const [prayer, setPrayer] = useState('');

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
      >
        <PrayerCard
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
  title: PropTypes.string,
  swipeForward: PropTypes.func,
  skipText: PropTypes.string,
  primaryButtonText: PropTypes.string,
  avatars: PropTypes.arrayOf(PropTypes.shape({})),
  AddedPrayerComponent: PropTypes.func,
};

export default AddPrayerConnected;
