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
          {({ data, loading, error }) => (
            <MediaControls
              data={data}
              loading={loading}
              error={error}
              liveStream={liveStream}
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
