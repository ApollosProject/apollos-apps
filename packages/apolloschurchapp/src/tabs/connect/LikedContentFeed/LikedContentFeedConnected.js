import React from 'react';
import { Query } from 'react-apollo';

import getLikedContent from '../getLikedContent';
import LikedContentFeed from './LikedContentFeed';

const LikedContentFeedConnected = () => (
  <Query query={getLikedContent} fetchPolicy="cache-and-network">
    {({ loading, data: { getAllLikedContent = [] } = {} }) => {
      if (!getAllLikedContent.length) return null;
      return (
        <LikedContentFeed
          id={'liked'}
          name={'Recently Like'}
          content={getAllLikedContent}
          isLoading={loading}
          loadingStateObject={{
            title: 'Recently Like',
            isLoading: true,
          }}
        />
      );
    }}
  </Query>
);

export default LikedContentFeedConnected;
