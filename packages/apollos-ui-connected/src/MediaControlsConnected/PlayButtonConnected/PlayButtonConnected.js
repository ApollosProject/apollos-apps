import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import { PLAY_VIDEO } from '@apollosproject/ui-media-player';

import PlayButton from './PlayButton';

const PlayButtonConnected = ({
  coverImageSources,
  isVideo,
  parentChannelName,
  title,
  videoSource,
  Component,
  ...props
}) => (
  <Mutation mutation={PLAY_VIDEO}>
    {(play) => (
      <Component
        onPress={() =>
          play({
            variables: {
              mediaSource: videoSource,
              posterSources: coverImageSources,
              title,
              isVideo,
              artist: parentChannelName,
            },
          })
        }
        coverImageSources={coverImageSources}
        {...props}
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
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};

PlayButtonConnected.defaultProps = {
  isVideo: true,
  Component: PlayButton,
};

export default PlayButtonConnected;
