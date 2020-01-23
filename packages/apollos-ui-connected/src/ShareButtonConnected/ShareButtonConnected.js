import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';

import { share } from '../utils';

import ShareButton from './ShareButton';
import GET_SHARE_CONTENT from './getShareContent';

const ShareButtonConnected = ({ itemId, message, onPress, title, url }) => (
  <AnalyticsConsumer>
    {({ track }) => (
      <Query query={GET_SHARE_CONTENT} variables={{ itemId }}>
        {({ data }) => {
          const sharing = get(data, 'node.sharing', {});
          const content = {
            id: itemId,
            title: title || sharing.title,
            message: message || sharing.message,
            url: url || sharing.url,
          };
          const handleOnPress = () => {
            if (onPress) {
              onPress(content);
            } else {
              share(content);
            }

            track({
              eventName: 'Share',
              properties: { id: itemId, title },
            });
          };

          return <ShareButton onPress={handleOnPress} />;
        }}
      </Query>
    )}
  </AnalyticsConsumer>
);

ShareButtonConnected.propTypes = {
  itemId: PropTypes.string.isRequired,
  // These props are available to override the default sharing data for a node.
  title: PropTypes.string,
  message: PropTypes.string,
  url: PropTypes.string,
  // Pass your own function and do whatever you want with the data.
  onPress: PropTypes.func,
};

export default ShareButtonConnected;
