import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';

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

export const REPORT_PRAYER = gql`
  mutation reportPrayer($prayerId: ID!) {
    reportPrayer(prayerId: $prayerId) {
      id
      text
    }
  }
`;

const PrayerScreen = ({
  PrayerCardComponent = PrayerCard,
  onPressPrimary,
  prayer,
  ...props
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
  const [reportPrayer] = useMutation(REPORT_PRAYER, {
    variables: {
      prayerId: prayer.id,
    },
    refetchQueries: ['getPrayerFeature', 'getPrayerListFeature'],
    onCompleted: () => {
      if (onPressPrimary) {
        onPressPrimary();
      }
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
      {...props}
    >
      <PrayerCardComponent
        prayerId={prayer.id}
        prayer={prayer.text}
        profile={prayer.requestor}
        title={`Pray for ${
          prayer.requestor?.nickName || prayer.requestor?.firstName || 'request'
        }`}
        reportPrayer={reportPrayer}
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
      lastName: PropTypes.string,
    }),
    text: PropTypes.string,
    __typename: PropTypes.string,
  }),
  onPressPrimary: PropTypes.func,
};

export default PrayerScreen;
