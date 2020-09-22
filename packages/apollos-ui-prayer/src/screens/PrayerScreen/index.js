import React, { useContext } from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';

import { AnalyticsContext } from '@apollosproject/ui-analytics';

import PrayerCard from '../../PrayerCard';
import PrayerView from '../../PrayerView';

export const PRAY = gql`
  mutation($prayerId: ID!) {
    prayed: interactWithNode(action: PRAY, nodeId: $prayerId) {
      success
    }
  }
`;

const PRAYER_FRAGMENT = gql`
  fragment PrayedFragment on PrayerRequest {
    isPrayed
  }
`;

const PrayerScreen = ({
  PrayerCardComponent = PrayerCard,
  onPressPrimary,
  prayer,
  ...screenProps
}) => {
  const { track } = useContext(AnalyticsContext);

  const [pray, { loading, data }] = useMutation(PRAY, {
    variables: { prayerId: prayer.id },
    update(cache) {
      cache.writeFragment({
        id: `${prayer.__typename}:${prayer.id}`,
        fragment: PRAYER_FRAGMENT,
        fragmentName: 'PrayedFragment',
        data: { ...prayer, isPrayed: true },
      });
    },
    onCompleted: () => {
      track({ eventName: 'PrayerPrayed', properties: { prayer } });
    },
  });

  const handleOnPressPrimary = () => {
    if (onPressPrimary) onPressPrimary();
    pray();
  };

  const hasPrayed = data?.prayed?.success || prayer.isPrayed;

  return (
    <PrayerView
      isLoding={loading}
      onPressPrimary={loading || hasPrayed ? null : handleOnPressPrimary}
      primaryActionText={hasPrayed ? 'Prayed!' : '🙏 Pray'}
      {...screenProps}
    >
      <PrayerCardComponent
        prayer={prayer.text}
        avatar={prayer.requestor?.photo || null}
        title={`Pray for ${prayer.requestor?.nickName ||
          prayer.requestor?.firstName}`}
      />
    </PrayerView>
  );
};

PrayerScreen.propTypes = {
  PrayerCardComponent: PropTypes.func,
  prayer: PropTypes.shape({
    id: PropTypes.string,
    isLoading: PropTypes.bool,
    isPrayed: PropTypes.bool,
    requestor: PropTypes.shape({
      /* eslint-disable-next-line */
      photo: PropTypes.any,
      nickName: PropTypes.string,
      firstName: PropTypes.string,
    }),
    text: PropTypes.string,
    __typename: PropTypes.string,
  }),
  onPressPrimary: PropTypes.func,
};

export default PrayerScreen;
