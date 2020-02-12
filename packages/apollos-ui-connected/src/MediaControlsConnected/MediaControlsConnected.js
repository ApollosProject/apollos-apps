import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import { LiveConsumer } from '../live';

import GET_CONTENT_MEDIA from './getContentMedia';

import MediaControls from './MediaControls';

const MediaControlsConnected = ({ Component, contentId, ...props }) => {
  if (!contentId) return null;
  return (
    <LiveConsumer contentId={contentId}>
      {(liveStream) => (
        <Query
          query={GET_CONTENT_MEDIA}
          fetchPolicy="cache-and-network"
          variables={{ contentId }}
        >
          {({
            data: {
              node: { videos, title, parentChannel = {}, coverImage = {} } = {},
            } = {},
            loading,
            error,
          }) => (
            <Component
              loading={loading}
              error={error}
              liveStream={liveStream}
              parentChannelName={parentChannel.name}
              title={title}
              videos={videos}
              coverImage={coverImage}
              {...props}
            />
          )}
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
};

MediaControlsConnected.defaultProps = {
  Component: MediaControls,
};

export default MediaControlsConnected;
