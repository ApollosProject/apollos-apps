import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import WebView from './WebView';
import PlayButtonConnected from './PlayButtonConnected';

const MediaControls = ({
  liveStream,
  loading,
  error,
  data: {
    node: { videos, title, parentChannel = {}, coverImage = {} } = {},
  } = {},
}) => {
  if (loading || error) return null;
  const isLive = !!liveStream;
  const hasLiveStreamContent = !!(
    get(liveStream, 'webViewUrl') || get(liveStream, 'media.sources[0]')
  );

  const videoSource = get(videos, '[0].sources[0]', null);
  const shouldRender = (isLive && hasLiveStreamContent) || videoSource;

  if (!shouldRender) return null;

  const coverImageSources = (coverImage && coverImage.sources) || [];

  // Content is live, and we have a livestream media
  if (isLive && get(liveStream, 'media.sources[0].uri')) {
    return (
      <PlayButtonConnected
        coverImageSources={coverImageSources}
        videoSource={liveStream.media.sources[0]}
        parentChannelName={parentChannel.name}
        title={title}
      />
    );
  }

  // Content is live, and we don't have a livestream media
  // but we do have a webview url
  if (isLive && get(liveStream, 'webViewUrl')) {
    return (
      <WebView
        webViewUrl={liveStream.webViewUrl}
        coverImageSources={coverImageSources}
      />
    );
  }

  // Default case, normal media.
  return (
    <PlayButtonConnected
      coverImageSources={coverImageSources}
      videoSource={videoSource}
      parentChannelName={parentChannel.name}
      title={title}
    />
  );
};

MediaControls.propTypes = {
  liveStream: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.string,
  data: PropTypes.shape({
    node: PropTypes.shape({
      videos: PropTypes.arrayOf(PropTypes.shape({})),
      title: PropTypes.string,
      parentChannel: PropTypes.shape({}),
      coverImage: PropTypes.shape({}),
    }),
  }),
};

export default MediaControls;
