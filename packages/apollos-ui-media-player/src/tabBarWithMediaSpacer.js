import React from 'react';
import { Platform, View } from 'react-native';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { styled } from '@apollosproject/ui-kit';
import MediaPlayerSpacer from './MediaPlayer/MediaPlayerSpacer';
import { GET_MEDIA_PLAYER_VISIBILITY } from './MediaPlayer/queries';

const TabBarWrapper = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.background.paper,
    ...Platform.select(theme.shadows.default),
  }),
  'ui-media.tabBarWithMediaSpacer.TabBarWrapper'
)(View);

// eslint-disable-next-line react/display-name
const withMediaSpacer = (TabBar) => (props) => (
  <Query query={GET_MEDIA_PLAYER_VISIBILITY}>
    {({ data = {} }) => (
      <TabBarWrapper mediaPlayerIsVisible={get(data, 'mediaPlayer.isVisible')}>
        <MediaPlayerSpacer>
          <TabBar
            {...props}
            // eslint-disable-next-line
            safeAreaInset={{ ...props.safeAreaInset, top: 0 }}
          />
        </MediaPlayerSpacer>
      </TabBarWrapper>
    )}
  </Query>
);

export default withMediaSpacer;
