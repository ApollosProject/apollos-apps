import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import { PLAY_VIDEO } from '@apollosproject/ui-media-player';

import PlayButton from './PlayButton';

const handleOnPress = (
  play,
  { coverImageSources, title, parentChannelName, videoSource }
) =>
  play({
    variables: {
      mediaSource: videoSource,
      posterSources: coverImageSources,
      title,
      isVideo: true,
      artist: parentChannelName,
    },
  });

const PlayButtonConnected = ({ coverImageSources }) => (
  <Mutation mutation={PLAY_VIDEO}>
    {(play) => (
      <PlayButton
        onPress={handleOnPress(play)}
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
