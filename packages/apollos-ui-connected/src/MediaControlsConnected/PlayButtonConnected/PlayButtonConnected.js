import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import { PLAY_VIDEO } from '@apollosproject/ui-media-player';

import PlayButton from './PlayButton';

const PlayButtonConnected = ({
  videoSource,
  coverImageSources,
  title,
  parentChannelName,
}) => (
  <Mutation mutation={PLAY_VIDEO}>
    {(play) => (
      <PlayButton
        onPress={() =>
          play({
            variables: {
              mediaSource: videoSource,
              posterSources: coverImageSources,
              title,
              isVideo: true,
              artist: parentChannelName,
            },
          })
        }
        coverImageSources={coverImageSources}
      />
    )}
  </Mutation>
);

PlayButtonConnected.propTypes = {
  videoSource: PropTypes.shape({}),
  coverImageSources: PropTypes.arrayOf(PropTypes.shape({})),
  title: PropTypes.string,
  parentChannelName: PropTypes.string,
};

export default PlayButtonConnected;
