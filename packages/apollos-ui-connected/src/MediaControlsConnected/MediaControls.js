import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import WebView from './WebView';
import PlayButtonConnected from './PlayButtonConnected';

const MediaControls = ({
  coverImageSources,
  error,
  liveStreamSource,
  loading,
  parentChannelName,
  title,
  videoSource,
  webViewUrl,
  ...props
}) => {
  if (loading || error) return null;

  let Control = null;

  //  We have a `liveStreamSource` so content is live!
  if (get(liveStreamSource, 'uri', false)) {
    Control = (
      <PlayButtonConnected
        coverImageSources={coverImageSources}
        parentChannelName={parentChannelName}
        title={title}
        videoSource={liveStreamSource}
        {...props}
      />
    );
  }
  // We don't have a `liveStreamSource` but we do have a `webviewUrl` so content is live!
  else if (webViewUrl) {
    Control = (
      <WebView
        coverImageSources={coverImageSources}
        webViewUrl={webViewUrl}
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
  liveStreamSource: PropTypes.string,
  loading: PropTypes.bool,
  parentChannelName: PropTypes.string,
  title: PropTypes.string,
  videoSource: PropTypes.shape({}),
  webViewUrl: PropTypes.string,
};

export default MediaControls;
