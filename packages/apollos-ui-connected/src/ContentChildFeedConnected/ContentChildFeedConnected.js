import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import ConnectedHorizontalFeed from '../ConnectedHorizontalFeed';
import GET_CONTENT_CHILD_SIBLINGS from './getContentChildSiblings';

const ContentChildNodeConnected = ({ nodeId, ...props }) => (
  <ConnectedHorizontalFeed
    {...props}
    query={GET_CONTENT_CHILD_SIBLINGS}
    variables={{ nodeId }}
    isItemDisabled={({ id }) => id === nodeId}
    isLoading={!nodeId}
    mapContentFromData={({ data }) => {
      const edges = get(data, 'node.siblingContentItemsConnected.edges', []);
      const content = edges.map((edge) => edge.node);
      const { cursor } = edges.length && edges[edges.length - 1];
      const currentIndex = content.findIndex(({ id }) => id === nodeId);

      return { currentIndex, nextCursor: cursor, content };
    }}
    updateQuery={(previousResult, { fetchMoreResult }) => {
      const newEdges = get(
        fetchMoreResult,
        'node.siblingContentItemsConnected.edges',
        []
      );
      return {
        node: {
          ...previousResult.node,
          siblingContentItemsConnected: {
            ...previousResult.node.siblingContentItemsConnected,
            edges: [
              ...previousResult.node.siblingContentItemsConnected.edges,
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
