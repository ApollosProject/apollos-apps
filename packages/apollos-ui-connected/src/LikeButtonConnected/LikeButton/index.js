import React from 'react';
import PropTypes from 'prop-types';

import { Icon, withTheme } from '@apollosproject/ui-kit';
import { ProtectedTouchable } from '@apollosproject/ui-auth';

const LikeIcon = withTheme(
  ({ theme: { colors: { secondary } = {} } = {}, isLiked } = {}) => ({
    name: isLiked ? 'like-solid' : 'like',
    fill: secondary,
  }),
  'ui-connected.LikeButtonConnected.LikeButton.LikeIcon'
)(Icon);

LikeIcon.propTypes = {
  isLiked: PropTypes.bool,
};

const LikeButton = ({ isLiked, toggleLike, nodeId, itemId }) => (
  <ProtectedTouchable
    onPress={() =>
      toggleLike({
        nodeId: nodeId || itemId,
        operation: isLiked ? 'Unlike' : 'Like',
      })
    }
  >
    <LikeIcon isLiked={isLiked} />
  </ProtectedTouchable>
);

LikeButton.propTypes = {
  itemId: PropTypes.string,
  nodeId: PropTypes.string,
  isLiked: PropTypes.bool,
  toggleLike: PropTypes.func,
};

export { LikeButton as default, LikeIcon };
