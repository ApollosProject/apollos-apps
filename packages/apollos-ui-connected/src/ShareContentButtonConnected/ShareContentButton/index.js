import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import { Touchable, Icon, withTheme } from '@apollosproject/ui-kit';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';
import { share } from '../../utils';

const enhance = compose(pure);

const ShareIcon = withTheme(({ theme }) => ({
  fill: theme.colors.secondary,
}))(Icon);

const ShareContentButton = enhance(({ content }) => (
  <AnalyticsConsumer>
    {({ track }) => {
      const onPress = () => {
        share(content);
        track({
          eventName: 'Share',
          properties: { id: content.id, title: content.title },
        });
      };
      return (
        <Touchable onPress={onPress}>
          <ShareIcon name={'share'} />
        </Touchable>
      );
    }}
  </AnalyticsConsumer>
));

ShareContentButton.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    id: PropTypes.string,
  }),
};

export default ShareContentButton;
