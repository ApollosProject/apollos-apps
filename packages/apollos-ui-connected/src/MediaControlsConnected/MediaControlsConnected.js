import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import { LiveConsumer } from '../live';

import GET_CONTENT_MEDIA from './getContentMedia';

import MediaControls from './MediaControls';

const MediaControlsConnected = ({ contentId }) => {
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
            <MediaControls
              loading={loading}
              error={error}
              liveStream={liveStream}
              parentChannelName={parentChannel.name}
              title={title}
              videos={videos}
              coverImage={coverImage}
            />
          )}
        </Query>
      )}
    </LiveConsumer>
  );
};

MediaControlsConnected.propTypes = {
  contentId: PropTypes.string,
};

export default MediaControlsConnected;
