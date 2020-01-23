import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Touchable, Icon, withTheme } from '@apollosproject/ui-kit';

const ShareIcon = withTheme(({ theme }) => ({
  fill: theme.colors.secondary,
}))(Icon);

const ShareContentButton = memo(({ onPress }) => (
  <Touchable onPress={onPress}>
    <ShareIcon name={'share'} />
  </Touchable>
));

ShareContentButton.displayName = 'ShareContentButton';

ShareContentButton.propTypes = {
  onPress: PropTypes.func,
};

export default ShareContentButton;
