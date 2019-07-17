import React, { Component } from 'react';
import { Query } from 'react-apollo';

import FullscreenPlayer from './FullscreenPlayer';

import { GET_MEDIA_PLAYER_VISIBILITY } from './queries';

/**
 * Selectively renders FullscreenPlayer component is MediaPlayer is visible
 */
class MediaPlayer extends Component {
  shouldComponentUpdate() {
    return false; // 🚀
  }

  renderPlayer = ({ data = {} }) => {
    if (!data.mediaPlayer || !data.mediaPlayer.isVisible) return null;
    return <FullscreenPlayer {...this.props} />;
  };

  render() {
    return (
      <Query query={GET_MEDIA_PLAYER_VISIBILITY}>{this.renderPlayer}</Query>
    );
  }
}

export default MediaPlayer;
