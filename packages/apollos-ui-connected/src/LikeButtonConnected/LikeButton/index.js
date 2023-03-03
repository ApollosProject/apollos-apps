import React from 'react';
import PropTypes from 'prop-types';

import { Icon, withTheme, Touchable } from '@apollosproject/ui-kit';

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
  <Touchable
    onPress={() =>
      toggleLike({
        nodeId: nodeId || itemId,
        operation: isLiked ? 'Unlike' : 'Like',
      })
    }
  >
    <LikeIcon isLiked={isLiked} />
  </Touchable>
);

LikeButton.propTypes = {
  itemId: PropTypes.string,
  nodeId: PropTypes.string,
  isLiked: PropTypes.bool,
  toggleLike: PropTypes.func,
};

export { LikeButton as default, LikeIcon };
