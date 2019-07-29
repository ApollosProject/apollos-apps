import React from 'react';

import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import ShareContentButton from 'apolloschurchapp/src/ui/ShareContentButton';

import GET_SHARE_CONTENT from './getShareContent';

const ShareContentButtonConnected = ({ itemId, title, url }) => (
  <Query query={GET_SHARE_CONTENT} variables={{ itemId }}>
    {({ data }) => {
      const sharing = get(data, 'node.sharing', {});
      const content = {
        id: itemId,
        title: title || sharing.title,
        url: url || sharing.url,
      };
      return <ShareContentButton content={content} />;
    }}
  </Query>
);

ShareContentButtonConnected.propTypes = {
  itemId: PropTypes.string.isRequired,
  // These props are available to override the default sharing data for a node.
  title: PropTypes.string,
  url: PropTypes.string,
};

export default ShareContentButtonConnected;
