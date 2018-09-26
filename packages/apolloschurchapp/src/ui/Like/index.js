import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';

import Icon from 'apolloschurchapp/src/ui/Icon';
import { withTheme } from 'apolloschurchapp/src/ui/theme';
import ProtectedTouchable from '../../auth/ProtectedTouchable';

const enhance = compose(
  pure,
  withTheme()
);

const Like = enhance(({ isLiked, toggleLike, itemId, theme }) => (
  <ProtectedTouchable
    onPress={() =>
      toggleLike({ itemId, operation: isLiked ? 'Unlike' : 'Like' })
    }
  >
    <Icon
      name={isLiked ? 'like-solid' : 'like'}
      fill={theme.colors.secondary}
    />
  </ProtectedTouchable>
));

Like.propTypes = {
  id: PropTypes.string,
  isLike: PropTypes.bool,
  toggleLike: PropTypes.func,
};

export default Like;
