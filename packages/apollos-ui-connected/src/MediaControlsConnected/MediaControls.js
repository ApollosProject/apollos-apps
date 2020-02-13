import React from 'react';
import PropTypes from 'prop-types';

import WebView from './WebView';
import PlayButtonConnected from './PlayButtonConnected';

const MediaControls = ({
  coverImageSources,
  error,
  isLive,
  liveStream,
  liveStreamSources,
  liveStreamUri,
  loading,
  parentChannelName,
  title,
  videoSource,
  videos,
  webViewUrl,
  ...props
}) => {
  if (loading || error) return null;

  let Control = null;

  // Content is live, and we have a livestream media
  if (isLive && liveStreamUri) {
    Control = (
      <PlayButtonConnected
        coverImageSources={coverImageSources}
        parentChannelName={parentChannelName}
        title={title}
        videoSource={liveStream.media.sources[0]}
        {...props}
      />
    );
  }
  // Content is live, and we don't have a livestream media
  // but we do have a webview url
  else if (isLive && webViewUrl) {
    Control = (
      <WebView
        coverImageSources={coverImageSources}
        webViewUrl={liveStream.webViewUrl}
        {...props}
      />
    );
  }
  // Default case, normal media.
  else {
    Control = (
      <PlayButtonConnected
        coverImageSources={coverImageSources}
        parentChannelName={parentChannelName}
        title={title}
        videoSource={videoSource}
        {...props}
      />
    );
  }

  return Control;
};

MediaControls.propTypes = {
  coverImageSources: PropTypes.arrayOf(PropTypes.shape({})),
  error: PropTypes.string,
  isLive: PropTypes.bool,
  liveStream: PropTypes.shape({}),
  liveStreamSources: PropTypes.string,
  liveStreamUri: PropTypes.string,
  loading: PropTypes.bool,
  parentChannelName: PropTypes.string,
  title: PropTypes.string,
  videoSource: PropTypes.shape({}),
  videos: PropTypes.arrayOf(PropTypes.shape({})),
  webViewUrl: PropTypes.string,
};

export default MediaControls;
