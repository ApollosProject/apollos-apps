import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { LiveConsumer } from '../live';

import GET_CONTENT_MEDIA from './getContentMedia';
import GET_NODE_MEDIA from './getNodeMedia';

import MediaControls from './MediaControls';

const MediaControlsConnected = ({ Component, contentId, nodeId, ...props }) => {
  if (!contentId && !nodeId) return null;
  return (
    <LiveConsumer contentId={contentId}>
      {(liveStream) => (
        <Query
          query={contentId ? GET_CONTENT_MEDIA : GET_NODE_MEDIA}
          fetchPolicy="cache-and-network"
          variables={contentId ? { contentId } : { nodeId }}
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
};

export default MediaControlsConnected;
