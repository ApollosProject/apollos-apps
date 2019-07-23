import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../CenteredView';
import BackgroundView from '../BackgroundView';

import { H5 } from '../typography';
import MediaThumbnail, { MediaThumbnailItem, MediaThumbnailIcon } from '.';

storiesOf('ui-kit/MediaThumbnail', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('kitchen sink', () => (
    <MediaThumbnail
      forceRatio={16 / 9}
      image={[
        {
          uri: 'https://picsum.photos/900/1600/?random',
        },
      ]}
    >
      <MediaThumbnailItem top left>
        <MediaThumbnailIcon name="brand-icon" />
      </MediaThumbnailItem>
      <MediaThumbnailItem top right>
        <MediaThumbnailIcon name="like" />
      </MediaThumbnailItem>
      <MediaThumbnailItem bottom left>
        <MediaThumbnailIcon name="download" />
      </MediaThumbnailItem>
      <MediaThumbnailItem bottom right>
        <MediaThumbnailIcon name="fullscreen" />
      </MediaThumbnailItem>
      <MediaThumbnailItem centered>
        <MediaThumbnailIcon name="play" />
        <H5>Play</H5>
      </MediaThumbnailItem>
    </MediaThumbnail>
  ));
