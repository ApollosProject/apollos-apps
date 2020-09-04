import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import ConnectedHorizontalFeed from '../ConnectedHorizontalFeed';
import GET_CONTENT_PARENT_CHILDREN from './getContentParentChildren';

const ContentParentSeriesFeed = ({ nodeId, ...props }) => (
  <ConnectedHorizontalFeed
    {...props}
    query={GET_CONTENT_PARENT_CHILDREN}
    variables={{ nodeId }}
    isItemDisabled={({ id }) => id === nodeId}
    isLoading={!nodeId}
    mapContentFromData={({ data }) => {
      const edges = get(data, 'node.childContentItemsConnection.edges', []);
      const content = edges.map((edge) => edge.node);
      const { cursor } = edges.length && edges[edges.length - 1];
      const currentIndex = content.findIndex(({ id }) => id === nodeId);

      return { currentIndex, nextCursor: cursor, content };
    }}
    updateQuery={(previousResult, { fetchMoreResult }) => {
      const newEdges = get(
        fetchMoreResult,
        'node.childContentItemsConnection.edges',
        []
      );
      return {
        node: {
          ...previousResult.node,
          childContentItemsConnection: {
            ...previousResult.node.childContentItemsConnection,
            edges: [
              ...previousResult.node.childContentItemsConnection.edges,
              ...newEdges,
            ],
          },
        },
      };
    }}
  />
);

ContentParentSeriesFeed.propTypes = {
  nodeId: PropTypes.string,
};

export default ContentParentSeriesFeed;
