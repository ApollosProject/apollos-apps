import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PrayerCard from '../PrayerCard';
import PrayerScreen from '../PrayerScreen';
import BackgroundImage from '../PrayerBlurBackground';

const PRAY = gql`
  mutation($prayerId: ID!) {
    prayed: interactWithNode(action: PRAY, nodeId: $prayerId) {
      success
    }
  }
`;

const PRAYER_FRAGMENT = gql`
  fragment prayed on PrayerRequest {
    isPrayed
  }
`;

const PrayingScreen = ({ prayer, onPressPrimary }) => {
  const [pray, { loading, data }] = useMutation(PRAY, {
    variables: { prayerId: prayer.id },
    update(cache) {
      cache.writeFragment({
        id: prayer.id,
        fragment: PRAYER_FRAGMENT,
        data: { isPrayed: true, __typename: 'PrayerRequest' },
      });
    },
  });

  const handleOnPressPrimary = () => {
    if (onPressPrimary) onPressPrimary();
    pray();
  };

  const hasPrayed = data?.prayed?.success || prayer.isPrayed;

  return (
    <PrayerScreen
      background={<BackgroundImage source={prayer.requestor?.photo || null} />}
      onPressPrimary={handleOnPressPrimary}
      primaryActionText={hasPrayed ? 'Prayed!' : '🙏 Pray'}
      buttonDisabled={loading || hasPrayed}
    >
      <PrayerCard
        prayer={prayer.text}
        avatar={prayer.requestor?.photo || null}
        title={`Pray for ${prayer.requestor?.nickName ||
          prayer.requestor?.firstName}`}
      />
    </PrayerScreen>
  );
};

PrayingScreen.propTypes = {
  prayer: PropTypes.shape({
    id: PropTypes.string,
    isPrayed: PropTypes.bool,
    requestor: PropTypes.shape({
      photo: PropTypes.any, // eslint-disable-line,
      nickName: PropTypes.string,
      firstName: PropTypes.string,
    }),
  }),
  onPressPrimary: PropTypes.func,
};

export default PrayingScreen;
