import React from 'react';
import { Text } from 'react-native';
import PrayerOnboardingScreen from '../PrayerOnboardingScreen';

const AddedPrayerScreen = (props) => (
  <PrayerOnboardingScreen
    primaryActionText={'Pray for others'}
    title={'Thank you for sharing.'}
    body={
      <Text>
        And if we know that he hears us—whatever we ask—we know that we have
        what we asked of him.{'\n'}
        <Text style={{ opacity: 0.5 }}>1 John 5:15</Text>
        {'\n\n'}
        We’re praying with you{'\n'}and believe in you.
      </Text>
    }
    {...props}
  />
);

export default AddedPrayerScreen;
