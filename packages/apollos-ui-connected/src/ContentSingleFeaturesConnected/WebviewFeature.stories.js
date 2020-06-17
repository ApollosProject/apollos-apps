import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';
import WebviewFeature from './WebviewFeature';

storiesOf('ui-connected/WebviewFeature', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('example', () => (
    <WebviewFeature
      url={
        'https://open.spotify.com/embed/user/spotify/playlist/37i9dQZF1DWWvHBEQLnV1N'
      }
      title={'Setlist'}
      linkText={'Open in Spotify'}
    />
  ));
