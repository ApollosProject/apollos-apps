import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import { PLAY_VIDEO } from '@apollosproject/ui-media-player';

import PlayButton from './PlayButton';

const handleOnPress = (
  coverImageSources,
  isVideo,
  parentChannelName,
  play,
  title,
  videoSource
) =>
  play({
    variables: {
      mediaSource: videoSource,
      posterSources: coverImageSources,
      title,
      isVideo,
      artist: parentChannelName,
    },
  });

const PlayButtonConnected = ({
  coverImageSources,
  isVideo,
  parentChannelName,
  title,
  videoSource,
}) => (
  <Mutation mutation={PLAY_VIDEO}>
    {(play) => (
      <PlayButton
        onPress={handleOnPress(
          coverImageSources,
          isVideo,
          parentChannelName,
          play,
          title,
          videoSource
        )}
        coverImageSources={coverImageSources}
      />
    )}
  </Mutation>
);

PlayButtonConnected.propTypes = {
  coverImageSources: PropTypes.arrayOf(PropTypes.shape({})),
  isVideo: PropTypes.bool,
  parentChannelName: PropTypes.string,
  title: PropTypes.string,
  videoSource: PropTypes.shape({}),
};

PlayButtonConnected.defaultProps = {
  isVideo: true,
};

export default PlayButtonConnected;
