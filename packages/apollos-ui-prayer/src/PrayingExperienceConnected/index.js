import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import PrayerCard from '../PrayerCard';
import PrayerScreen from '../PrayerScreen';
import PrayerSwiper from '../PrayerSwiper';

import AddPrayerConnected from '../AddPrayerConnected';

const GET_PRAYER_FEATURE = gql`
  query($id: ID!) {
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
}) => {
  const { loading, error, data } = useQuery(GET_PRAYER_FEATURE, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  // if (loading) return 'Loading...';
  // if (error) return `Error! ${error.message}`;

  const { prayers = [] } = data?.feature || {};

  return (
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
  );
};

PrayingExperienceConnected.propTypes = {
  id: PropTypes.string.isRequired,
  AddPrayerComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default PrayingExperienceConnected;
