import React, { useState } from 'react';
import { StyleSheet, Animated, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PrayerCard from '../PrayerCard';
import PrayerScreen from '../PrayerScreen';
import PrayerSwiper from '../PrayerSwiper';

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

const AddPrayerConnected = ({ title = 'Add your prayer' }) => {
  const { data: userData } = useQuery(GET_USER_PHOTO);
  const {
    currentUser: { profile: { photo = null } = {} },
  } = userData || {};

  const [addPrayer, { loading, error, data }] = useMutation(ADD_PRAYER);
  const [prayer, setPrayer] = useState('');

  const animation = new Animated.Value(0);

  if (data?.addPrayer) {
    Animated.spring(animation, { toValue: 1 }).start();
  }

  const window = Dimensions.get('window');

  return (
    <PrayerScreen
      onPressPrimary={() => addPrayer({ variables: { prayer } })}
      buttonDisabled={loading || !prayer.length}
      isLoading={loading}
    >
      <>
        <PrayerCard
          avatar={photo || null}
          title={title}
          onPrayerChangeText={setPrayer}
        />
        {data?.addPrayer ? (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'salmon',
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [window.height, 0],
                    }),
                  },
                ],
              },
            ]}
          />
        ) : null}
      </>
    </PrayerScreen>
  );
};

AddPrayerConnected.propTypes = {
  title: PropTypes.string,
};

export default AddPrayerConnected;
