import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Touchable, Icon, withTheme } from '@apollosproject/ui-kit';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';
import { share } from '../../utils';

const ShareIcon = withTheme(({ theme }) => ({
  fill: theme.colors.secondary,
}))(Icon);

const ShareContentButton = memo(({ content, onPress }) => (
  <AnalyticsConsumer>
    {({ track }) => {
      let handleOnPress = onPress;

      if (!onPress) {
        handleOnPress = () => {
          share(content);
          track({
            eventName: 'Share',
            properties: { id: content.id, title: content.title },
          });
        };
      }

      return (
        <Touchable onPress={handleOnPress}>
          <ShareIcon name={'share'} />
        </Touchable>
      );
    }}
  </AnalyticsConsumer>
));

ShareContentButton.displayName = 'ShareContentButton';

ShareContentButton.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func,
};

export default ShareContentButton;
