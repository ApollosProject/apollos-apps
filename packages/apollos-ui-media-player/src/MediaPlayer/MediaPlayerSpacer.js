import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { styled } from '@apollosproject/ui-kit';
import { SafeAreaView } from 'react-navigation';
import { MINI_PLAYER_HEIGHT } from './MiniControls';

import MediaPlayerSafeLayout from './MediaPlayerSafeLayout';
import { getMediaPlayerVisibility } from './queries';

const MediaPlayerSafeLayoutWithSpacing = styled({
  paddingBottom: MINI_PLAYER_HEIGHT,
})(MediaPlayerSafeLayout);

const MediaPlayerSpacer = (props) => (
  <Query query={getMediaPlayerVisibility}>
    {({ data = {} }) =>
      get(data, 'mediaPlayer.isVisible') ? (
        <MediaPlayerSafeLayoutWithSpacing {...props} />
      ) : (
        <SafeAreaView forceInset={{ bottom: 'always' }} {...props} />
      )
    }
  </Query>
);

export default MediaPlayerSpacer;
