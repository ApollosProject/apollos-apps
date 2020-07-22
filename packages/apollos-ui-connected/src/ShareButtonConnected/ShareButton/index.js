import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Touchable, Icon, withTheme } from '@apollosproject/ui-kit';

const ShareIcon = withTheme(
  ({ theme }) => ({
    fill: theme.colors.secondary,
  }),
  'ui-connected.ShareButtonConnected.ShareButton.ShareIcon'
)(Icon);

const ShareButton = memo(({ onPress }) => (
  <Touchable onPress={onPress}>
    <ShareIcon name={'share'} />
  </Touchable>
));

ShareButton.displayName = 'ShareButton';

ShareButton.propTypes = {
  onPress: PropTypes.func,
};

export default ShareButton;
