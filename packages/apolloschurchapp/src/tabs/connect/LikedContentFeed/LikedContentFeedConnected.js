import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import getLikedContent from '../getLikedContent';
import LikedContentFeed from './LikedContentFeed';

const LikedContentFeedConnected = ({ navigation }) => (
  <Query query={getLikedContent} fetchPolicy="cache-and-network">
    {({ loading, data: { getAllLikedContent = [] } = {} }) => {
      if (!getAllLikedContent.length) return null;
      return (
        <LikedContentFeed
          id={'liked'}
          name={'Recently Like'}
          content={getAllLikedContent}
          isLoading={loading}
          navigation={navigation}
          loadingStateObject={{
            title: 'Recently Like',
            isLoading: true,
          }}
        />
      );
    }}
  </Query>
);

LikedContentFeedConnected.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default LikedContentFeedConnected;
