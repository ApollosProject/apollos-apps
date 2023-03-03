import React from 'react';
import { Text } from 'react-native';

import { ScriptureText, VerseNumber } from '@apollosproject/ui-scripture';
import { BodyText, named } from '@apollosproject/ui-kit';

import PrayerDialogScreen from '../PrayerDialogScreen';

const ConfirmationDialogScreen = (props) => (
  <PrayerDialogScreen
    primaryActionText={'Pray for others'}
    title={'Thank you for sharing.'}
    body={
      <Text>
        <ScriptureText>
          This is the confidence we have in approaching God: that if we ask
          anything according to his will, he hears us.{'\n'}
          <VerseNumber>1 John 5:14</VerseNumber>
        </ScriptureText>
        {'\n\n'}
        <BodyText>We’re praying with you{'\n'}and believe in you.</BodyText>
      </Text>
    }
    {...props}
  />
);

export default named('ui-prayer.Confirmation')(ConfirmationDialogScreen);
