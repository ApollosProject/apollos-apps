import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import BackgroundView from '../BackgroundView';

import CoverPlayer from './CoverPlayer';

const getMediaPlayerVisibility = gql`
  query mediaPlayer {
    mediaPlayer @client {
      isVisible
    }
  }
`;

class MediaPlayer extends PureComponent {
  renderPlayer = ({ data = {} }) => {
    if (!data.mediaPlayer || !data.mediaPlayer.isVisible) return null;
    return <CoverPlayer />;
  };

  render() {
    return (
      <BackgroundView>
        {this.props.children}
        <Query query={getMediaPlayerVisibility}>{this.renderPlayer}</Query>
      </BackgroundView>
    );
  }
}

export default MediaPlayer;
