import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { View } from 'react-native';
import { get } from 'lodash';

import { playVideoMutation } from 'apolloschurchapp/src/ui/MediaPlayer/mutations';
import Icon from 'apolloschurchapp/src/ui/Icon';
import TouchableScale from 'apolloschurchapp/src/ui/TouchableScale';
import getContentMedia from './getContentMedia';

const MediaIcon = Icon; // todo: add back styles

class MediaControls extends PureComponent {
  static propTypes = {
    contentId: PropTypes.string,
  };

  renderControls = ({
    loading,
    error,
    data: {
      node: { videos, audios, title, parentChannel = {}, coverImage = {} } = {},
    } = {},
  }) => {
    if (loading || error) return null;

    const videoSource = get(videos, '[0].sources[0]', null);
    const audioSource = get(audios, '[0].sources[0]', null);
    const coverImageSources = (coverImage && coverImage.source) || [];

    return (
      <Mutation mutation={playVideoMutation}>
        {(play) => (
          <View>
            {videoSource ? (
              <TouchableScale
                onPress={() =>
                  play({
                    variables: {
                      mediaSource: videoSource,
                      posterSources: coverImageSources,
                      title,
                      isVideo: true,
                      artist: parentChannel.name,
                    },
                  })
                }
              >
                <MediaIcon name="video" />
              </TouchableScale>
            ) : null}
            {audioSource ? (
              <TouchableScale
                onPress={() =>
                  play({
                    variables: {
                      mediaSource: audioSource,
                      posterSources: coverImageSources,
                      title,
                      isVideo: false,
                      artist: parentChannel.name,
                    },
                  })
                }
              >
                <MediaIcon name="audio" />
              </TouchableScale>
            ) : null}
          </View>
        )}
      </Mutation>
    );
  };

  render() {
    if (!this.props.contentId) return null;
    return (
      <Query
        query={getContentMedia}
        variables={{ contentId: this.props.contentId }}
      >
        {this.renderControls}
      </Query>
    );
  }
}

export default MediaControls;
