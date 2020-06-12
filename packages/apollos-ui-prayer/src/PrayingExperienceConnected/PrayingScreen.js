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

const PrayingScreen = ({ prayer, onPressPrimary }) => {
  const [pray, { loading, data }] = useMutation(PRAY, {
    variables: { prayerId: prayer.id },
  });

  const handleOnPressPrimary = () => {
    if (onPressPrimary) onPressPrimary();
    pray();
  };

  return (
    <PrayerScreen
      background={<BackgroundImage source={prayer.requestor?.photo || null} />}
      onPressPrimary={handleOnPressPrimary}
      primaryActionText={data?.prayed?.success ? 'Prayed!' : '🙏 Pray'}
      buttonDisabled={loading || data?.prayed?.success}
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
    requestor: PropTypes.shape({
      photo: PropTypes.any, // eslint-disable-line,
      nickName: PropTypes.string,
      firstName: PropTypes.string,
    }),
  }),
  onPressPrimary: PropTypes.func,
};

export default PrayingScreen;
