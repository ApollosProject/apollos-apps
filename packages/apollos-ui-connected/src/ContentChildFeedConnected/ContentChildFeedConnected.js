import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import HorizontalFeedConnected from '../HorizontalFeedConnected';
import GET_CONTENT_CHILD_SIBLINGS from './getContentChildSiblings';

const ContentChildNodeConnected = ({ nodeId, ...props }) => (
  <HorizontalFeedConnected
    {...props}
    query={GET_CONTENT_CHILD_SIBLINGS}
    variables={{ nodeId }}
    isItemDisabled={({ id }) => id === nodeId}
    isLoading={!nodeId}
    mapContentFromData={({ data }) => {
      const edges = get(data, 'node.siblingContentItemsConnection.edges', []);
      const content = edges.map((edge) => edge.node);
      const { cursor } = edges.length && edges[edges.length - 1];
      const currentIndex = content.findIndex(({ id }) => id === nodeId);

      return { currentIndex, nextCursor: cursor, content };
    }}
    updateQuery={(previousResult, { fetchMoreResult }) => {
      const newEdges = get(
        fetchMoreResult,
        'node.siblingContentItemsConnection.edges',
        []
      );
      return {
        node: {
          ...previousResult.node,
          siblingContentItemsConnection: {
            ...previousResult.node.siblingContentItemsConnection,
            edges: [
              ...previousResult.node.siblingContentItemsConnection.edges,
              ...newEdges,
            ],
          },
        },
      };
    }}
  />
);

ContentChildNodeConnected.propTypes = {
  nodeId: PropTypes.string,
};

export default ContentChildNodeConnected;
