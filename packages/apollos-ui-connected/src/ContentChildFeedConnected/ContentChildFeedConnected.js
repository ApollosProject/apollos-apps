import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { named } from '@apollosproject/ui-kit';

import HorizontalFeedConnected from '../HorizontalFeedConnected';
import GET_CONTENT_CHILD_SIBLINGS from './getContentChildSiblings';

const ContentChildNodeConnected = ({ nodeId, loadingStateTypes, ...props }) => {
  const loadingEnabled = loadingStateTypes.includes(nodeId.split(':')[0]);
  if (!nodeId && !loadingEnabled) {
    return null;
  }

  return (
    <HorizontalFeedConnected
      {...props}
      query={GET_CONTENT_CHILD_SIBLINGS}
      variables={{ nodeId }}
      isItemDisabled={({ id }) => id === nodeId}
      isLoading={loadingEnabled && !nodeId}
      mapContentFromData={({ data }) => {
        const edges = get(data, 'node.siblingContentItemsConnection.edges', []);
        const content = edges.map((edge) => edge.node);
        const { cursor } = edges.length && edges[edges.length - 1];
        const currentIndex = content.findIndex(({ id }) => id === nodeId);

        return { currentIndex, nextCursor: cursor, content };
      }}
      collectionName="node.siblingContentItemsConnection"
    />
  );
};

ContentChildNodeConnected.propTypes = {
  nodeId: PropTypes.string,
  loadingStateTypes: PropTypes.arrayOf(PropTypes.string),
};

ContentChildNodeConnected.defaultProps = {
  loadingStateTypes: ['WeekendContentItem', 'DevotionalContentItem'],
};

export default named('ContentChildNodeConnected')(ContentChildNodeConnected);
