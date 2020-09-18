import React from 'react';

import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query, Mutation } from 'react-apollo';

import { AnalyticsConsumer } from '@apollosproject/ui-analytics';

import LikeButton from './LikeButton';
import UPDATE_LIKE_NODE from './updateLikeNode';
import GET_LIKED_NODE from './getLikedNode';
import updateLikedContent from './updateLikedContent';

const GetLikeData = ({ nodeId, children }) => (
  <Query query={GET_LIKED_NODE} variables={{ nodeId }}>
    {({ data: { node = {} } = {}, loading }) => {
      // We shouldn't render anything if the current node isn't likeable.
      if (!loading && (node && node.isLiked == null)) return null;
      const isLiked = loading ? false : get(node, 'isLiked') || false;
      // We pass down node as `item` for backwards compatibility.
      // TODO: deprecate item prop
      return children({ isLiked, item: node, node });
    }}
  </Query>
);

GetLikeData.propTypes = {
  nodeId: PropTypes.string,
  children: PropTypes.func.isRequired,
};

const UpdateLikeStatus = ({
  nodeId,
  node = { __typename: null },
  isLiked,
  children,
}) => (
  <AnalyticsConsumer>
    {({ track }) => (
      <Mutation
        mutation={UPDATE_LIKE_NODE}
        optimisticResponse={{
          updateLikeNode: {
            id: nodeId, // unknown at this time
            isLiked: !isLiked,
            likedCount: 0, // field required but exact value is not needed
            __typename: node && node.__typename,
          },
        }}
        update={(
          cache,
          {
            data: {
              updateLikeNode: { isLiked: liked },
            },
          }
        ) => {
          updateLikedContent({ liked, cache, item: node });
          cache.writeQuery({
            query: GET_LIKED_NODE,
            data: {
              node: {
                ...node,
                isLiked: liked,
              },
            },
          });
        }}
      >
        {(createNewInteraction) =>
          nodeId
            ? children({
                nodeId,
                isLiked,
                toggleLike: async (variables) => {
                  try {
                    await createNewInteraction({ variables });
                    track({
                      eventName: isLiked ? 'UnlikeNode' : 'LikeNode',
                      properties: {
                        id: nodeId,
                      },
                    });
                  } catch (e) {
                    throw e.message;
                  }
                },
              })
            : null
        }
      </Mutation>
    )}
  </AnalyticsConsumer>
);

UpdateLikeStatus.propTypes = {
  nodeId: PropTypes.string,
  children: PropTypes.func.isRequired,
  isLiked: PropTypes.bool.isRequired,
  node: PropTypes.shape({
    id: PropTypes.string,
    __typename: PropTypes.string,
    isLiked: PropTypes.bool,
  }),
};

const LikeButtonConnected = ({ Component, itemId, nodeId, ...props }) => (
  <GetLikeData nodeId={nodeId || itemId}>
    {({ isLiked, node }) => (
      <UpdateLikeStatus nodeId={nodeId || itemId} node={node} isLiked={isLiked}>
        {({ toggleLike, isLiked: newLikeValue }) => (
          <Component
            itemId={itemId}
            nodeId={nodeId}
            isLiked={newLikeValue}
            toggleLike={toggleLike}
            {...props}
          />
        )}
      </UpdateLikeStatus>
    )}
  </GetLikeData>
);

LikeButtonConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  itemId: PropTypes.string,
  nodeId: PropTypes.string,
};

LikeButtonConnected.defaultProps = {
  Component: LikeButton,
};

export default LikeButtonConnected;
