import { useCallback } from 'react';

import { useQuery, useMutation } from '@apollo/client';

import { useTrack } from '@apollosproject/ui-analytics';

import UPDATE_LIKE_NODE from './updateLikeNode';
import GET_LIKED_NODE from './getLikedNode';
import updateLikedContent from './updateLikedContent';

const useLike = (nodeId) => {
  const { data: { node = {} } = {}, loading } = useQuery(GET_LIKED_NODE, {
    variables: { nodeId },
  });
  const isLikeable = !(!loading && node && node.isLiked == null);
  const isLiked = loading ? false : node?.isLiked || false;

  const track = useTrack();
  const [likeInteraction] = useMutation(UPDATE_LIKE_NODE, {
    variables: { nodeId, operation: isLiked ? 'Unlike' : 'Like' },
    optimisticResponse: {
      updateLikeNode: {
        id: nodeId,
        isLiked: !isLiked,
        likedCount: 0,
        __typename: node && node.__typename,
      },
      update: (
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
      },
    },
  });

  const like = useCallback(async () => {
    if (!isLikeable) {
      return;
    }
    try {
      await likeInteraction();
      track({
        eventName: isLiked ? 'UnlikeNode' : 'LikeNode',
        properties: {
          id: nodeId,
        },
      });
    } catch (e) {
      throw e.message;
    }
  }, [likeInteraction, track, nodeId, isLiked, isLikeable]);

  return [isLiked, like];
};

export default useLike;
