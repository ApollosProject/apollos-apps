import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

import HorizontalFeedConnected from '../HorizontalFeedConnected';

import GET_CONTENT_SERIES from './getContentSeries';

const getIsParent = (data) => {
  const children = get(data, 'node.childContentItemsConnection.edges', []);
  return children.length > 0;
};

const HorizontalContentSeriesFeedConnected = ({ contentId, ...props }) => (
  <HorizontalFeedConnected
    {...props}
    query={GET_CONTENT_SERIES}
    variables={{ itemId: contentId }}
    isItemDisabled={({ id }) => id === contentId}
    isLoading={!contentId}
    mapContentFromData={({ data }) => {
      const connection = getIsParent(data)
        ? 'childContentItemsConnection'
        : 'siblingContentItemsConnection';
      const edges = get(data, `node.${connection}.edges`) || [];

      const content = edges.map((edge) => edge.node);
      const { cursor } = edges.length && edges[edges.length - 1];
      const currentIndex = content.findIndex(({ id }) => id === contentId);

      return { currentIndex, nextCursor: cursor, content };
    }}
    updateQuery={(previousResult, { fetchMoreResult }) => {
      const connection = getIsParent(previousResult)
        ? 'childContentItemsConnection'
        : 'siblingContentItemsConnection';
      const newEdges = get(fetchMoreResult, `node.${connection}.edges`) || [];

      return {
        node: {
          ...previousResult.node,
          [connection]: {
            ...previousResult.node[connection],
            edges: [...previousResult.node[connection].edges, ...newEdges],
          },
        },
      };
    }}
  />
);

HorizontalContentSeriesFeedConnected.propTypes = {
  contentId: PropTypes.string,
};

export default withNavigation(HorizontalContentSeriesFeedConnected);
