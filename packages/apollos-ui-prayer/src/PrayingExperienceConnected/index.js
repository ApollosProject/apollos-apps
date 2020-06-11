import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import PrayerCard from '../PrayerCard';
import PrayerScreen from '../PrayerScreen';
import PrayerSwiper from '../PrayerSwiper';

const GET_PRAYER_FEATURE = gql`
  query($id: ID!) {
    node(id: $id) {
      # todo - this needs to be broken up into fragments
      ... on PrayerListFeature {
        prayers {
          id
          text
          requestor {
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

// todo: does this component belong here or ui-connected??
const PrayingExperienceConnected = ({ id }) => (
  <Query
    query={GET_PRAYER_FEATURE}
    variables={{ id }}
    fetchPolicy={'cache-and-network'}
  >
    {({ data = {} }) => {
      const { prayers = [] } = data?.node || {};
      return (
        <PrayerSwiper>
          {() =>
            prayers.map((prayer) => (
              <PrayerScreen key={prayer.id}>
                <PrayerCard
                  prayer={prayer.text}
                  avatar={prayer.requestor?.photo?.uri || null}
                  title={`Pray for ${prayer.requestor?.nickName ||
                    prayer.requestor?.firstName}`}
                />
              </PrayerScreen>
            ))
          }
        </PrayerSwiper>
      );
    }}
  </Query>
);

PrayingExperienceConnected.propTypes = {
  id: PropTypes.string.isRequired,
};

export default PrayingExperienceConnected;
