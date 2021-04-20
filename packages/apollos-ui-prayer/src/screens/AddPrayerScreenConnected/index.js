import React, { useState, useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { named } from '@apollosproject/ui-kit';
import { AnalyticsContext } from '@apollosproject/ui-analytics';

import PrayerCard from '../../PrayerCard';
import PrayerView from '../../PrayerView';

import ConfirmationDialogScreen from '../ConfirmationDialogScreen';

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
        firstName
        lastName
        id
        photo {
          uri
        }
      }
    }
  }
`;

const AddPrayerScreenConnected = ({
  PrayerCardComponent = PrayerCard,
  title = 'Add your prayer',
  skipText = 'No thanks',
  primaryButtonText = 'Share prayer',
  swipeForward,
  avatars = [],
  AddedPrayerComponent = ConfirmationDialogScreen,
  ...props
}) => {
  const { data: userData } = useQuery(GET_USER_PHOTO);
  const photo = userData?.currentUser?.profile?.photo;
  const profile = userData?.currentUser?.profile;

  const { track } = useContext(AnalyticsContext);

  const [prayer, setPrayer] = useState('');

  const [addPrayer, { loading, data }] = useMutation(ADD_PRAYER, {
    onCompleted: () => {
      track({ eventName: 'PrayerAdded', properties: { prayer } });
    },
  });

  const completed = data?.addPrayer;

  return (
    <>
      <PrayerView
        secondaryActionText={skipText}
        onPressSecondary={swipeForward}
        primaryActionText={primaryButtonText}
        onPressPrimary={
          loading || !prayer.length
            ? null
            : () => addPrayer({ variables: { prayer } })
        }
        isLoading={loading}
        {...props}
      >
        <PrayerCardComponent
          profile={profile}
          title={title}
          onPrayerChangeText={setPrayer}
          completed={completed}
        />
      </PrayerView>
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

AddPrayerScreenConnected.propTypes = {
  PrayerCardComponent: PropTypes.func,
  title: PropTypes.string,
  swipeForward: PropTypes.func,
  skipText: PropTypes.string,
  primaryButtonText: PropTypes.string,
  avatars: PropTypes.arrayOf(PropTypes.shape({})),
  AddedPrayerComponent: PropTypes.func,
};

export default named('ui-prayer.AddPrayerScreenConnected')(
  AddPrayerScreenConnected
);
