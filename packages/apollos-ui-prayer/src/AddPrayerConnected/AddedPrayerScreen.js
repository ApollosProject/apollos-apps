import React from 'react';
import { Text } from 'react-native';
import { ScriptureText, VerseNumber } from '@apollosproject/ui-scripture';
import PrayerOnboardingScreen from '../PrayerOnboardingScreen';

const AddedPrayerScreen = (props) => (
  <PrayerOnboardingScreen
    primaryActionText={'Pray for others'}
    title={'Thank you for sharing.'}
    body={
      <Text>
        <ScriptureText>
          And if we know that he hears us—whatever we ask—we know that we have
          what we asked of him.{'\n'}
          <VerseNumber>1 John 5:15</VerseNumber>
        </ScriptureText>
        {'\n\n'}
        We’re praying with you{'\n'}and believe in you.
      </Text>
    }
    {...props}
  />
);

export default AddedPrayerScreen;
