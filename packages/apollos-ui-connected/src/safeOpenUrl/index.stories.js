/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { BackgroundView, CenteredView, Button } from '@apollosproject/ui-kit';
import safeOpenUrl from './index';

storiesOf('ui-connected/safeOpenUrl', module)
  .addDecorator((story) => (
    <BackgroundView>
      <CenteredView
        style={{ alignItems: 'stretch', justifyContent: 'space-around' }}
      >
        {story()}
      </CenteredView>
    </BackgroundView>
  ))
  .add('examples', () => (
    <>
      <Button
        onPress={() => safeOpenUrl('https://github.com')}
        title="Open Web Link"
      />
      <Button
        title="Open App Deep Link"
        onPress={() =>
          safeOpenUrl(
            'apolloschurchapp://navigate/ContentSingle?itemId=?WeekendContentItem:cdfcef9941c7140b303251714b9b7ecd'
          )
        }
      />
      <Button
        title="Open Email Link (won't work on sim)"
        onPress={() => safeOpenUrl('mailto:vincent@differential.com')}
      />
    </>
  ));
