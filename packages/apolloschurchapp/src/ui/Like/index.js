import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import Icon from 'apolloschurchapp/src/ui/Icon';
import Touchable from 'apolloschurchapp/src/ui/Touchable';
import { withTheme } from 'apolloschurchapp/src/ui/theme';
import ProtectedAction from '../../auth/ProtectedAction';

const enhance = compose(
  pure,
  withTheme()
);

const Like = enhance(({ isLiked, toggleLike, itemId, operation, theme }) => (
  <ProtectedAction>
    {(protect) => (
      <Touchable onPress={protect(() => toggleLike({ itemId, operation }))}>
        <Icon
          name={isLiked ? 'like-solid' : 'like'}
          fill={theme.colors.secondary}
        />
      </Touchable>
    )}
  </ProtectedAction>
));

Like.propTypes = {
  id: PropTypes.string,
  isLike: PropTypes.bool,
  toggleLike: PropTypes.func,
};

export default Like;
