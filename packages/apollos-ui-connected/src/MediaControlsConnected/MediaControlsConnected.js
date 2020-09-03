import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { LiveConsumer } from '../live';

import GET_MEDIA from './getMedia';
import GET_CONTENT_MEDIA from './getContentMedia';

import MediaControls from './MediaControls';

const MediaControlsConnected = ({
  useVideoNodeFragment,
  Component,
  contentId,
  nodeId,
  ...props
}) => {
  if (!contentId && !nodeId) return null;
  return (
    <LiveConsumer contentId={contentId}>
      {(liveStream) => (
        <Query
          query={useVideoNodeFragment ? GET_MEDIA : GET_CONTENT_MEDIA}
          fetchPolicy="cache-and-network"
          variables={{ nodeId: nodeId || contentId }}
        >
          {({
            data: {
              node: { videos, title, parentChannel = {}, coverImage = {} } = {},
            } = {},
            loading,
            error,
          }) => {
            const coverImageSources = (coverImage && coverImage.sources) || [];
            const liveStreamSource = get(liveStream, 'media.sources[0]');
            const videoSource = get(videos, '[0].sources[0]', null);
            const webViewUrl = get(liveStream, 'webViewUrl');

            // if we don't have a media source don't render
            if (!(webViewUrl || liveStreamSource || videoSource)) return null;

            return (
              <Component
                coverImage={coverImage}
                coverImageSources={coverImageSources}
                error={error}
                liveStreamSource={liveStreamSource}
                loading={loading}
                parentChannelName={parentChannel?.name}
                title={title}
                videoSource={videoSource}
                webViewUrl={webViewUrl}
                {...props}
              />
            );
          }}
        </Query>
      )}
    </LiveConsumer>
  );
};

MediaControlsConnected.propTypes = {
  useVideoNodeFragment: PropTypes.bool,
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  contentId: PropTypes.string,
  nodeId: PropTypes.string,
};

MediaControlsConnected.defaultProps = {
  Component: MediaControls,
  useVideoNodeFragment: false,
};

export default MediaControlsConnected;
