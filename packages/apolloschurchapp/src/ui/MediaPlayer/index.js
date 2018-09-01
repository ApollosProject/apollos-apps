import React, { Component } from 'react';
import { Query } from 'react-apollo';

import CoverPlayer from './CoverPlayer';

import { getMediaPlayerVisibility } from './queries';

/**
 * Selectively renders CoverPlayer component is MediaPlayer is visible
 */
class MediaPlayer extends Component {
  shouldComponentUpdate() {
    return false; // 🚀
  }

  renderPlayer = ({ data = {} }) => {
    if (!data.mediaPlayer || !data.mediaPlayer.isVisible) return null;
    return <CoverPlayer />;
  };

  render() {
    return <Query query={getMediaPlayerVisibility}>{this.renderPlayer}</Query>;
  }
}

export default MediaPlayer;
