import React from 'react';
import { SafeAreaView } from 'react-native';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { styled } from '@apollosproject/ui-kit';
import { MINI_PLAYER_HEIGHT } from './MiniControls';

import MediaPlayerSafeLayout from './MediaPlayerSafeLayout';
import { GET_MEDIA_PLAYER_VISIBILITY } from './queries';

const MediaPlayerSafeLayoutWithSpacing = styled({
  paddingBottom: MINI_PLAYER_HEIGHT,
})(MediaPlayerSafeLayout);

const MediaPlayerSpacer = (props) => (
  <Query query={GET_MEDIA_PLAYER_VISIBILITY}>
    {({ data = {} }) =>
      get(data, 'mediaPlayer.isVisible') ? (
        <MediaPlayerSafeLayoutWithSpacing {...props} />
      ) : (
        <SafeAreaView {...props} />
      )
    }
  </Query>
);

export default MediaPlayerSpacer;
