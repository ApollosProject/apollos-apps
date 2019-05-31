import React from 'react';
import { Platform, View } from 'react-native';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { styled } from '@apollosproject/ui-kit';
import MediaPlayerSpacer from './MediaPlayer/MediaPlayerSpacer';
import { getMediaPlayerVisibility } from './MediaPlayer/queries';

const TabBarWrapper = styled(({ theme, mediaPlayerIsVisible }) => ({
  backgroundColor: mediaPlayerIsVisible
    ? theme.colors.screen
    : theme.colors.paper,
  ...Platform.select(theme.shadows.default),
}))(View);

// eslint-disable-next-line react/display-name
const withMediaSpacer = (TabBar) => (props) => (
  <Query query={getMediaPlayerVisibility}>
    {({ data = {} }) => (
      <TabBarWrapper mediaPlayerIsVisible={get(data, 'mediaPlayer.isVisible')}>
        <MediaPlayerSpacer>
          <TabBar {...props} />
        </MediaPlayerSpacer>
      </TabBarWrapper>
    )}
  </Query>
);

export default withMediaSpacer;
