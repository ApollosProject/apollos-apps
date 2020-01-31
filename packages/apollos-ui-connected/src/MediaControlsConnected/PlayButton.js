import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  styled,
  TouchableScale,
  MediaThumbnail,
  MediaThumbnailIcon,
  MediaThumbnailItem,
  H6,
} from '@apollosproject/ui-kit';

const Container = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  marginTop: -(theme.sizing.baseUnit * 2.5),
}))(View);

const StyledMediaThumbnail = styled({ marginVertical: 0 })(MediaThumbnail);

const PlayButton = ({ action, coverImageSources }) => (
  <Container>
    <TouchableScale onPress={action}>
      <StyledMediaThumbnail image={coverImageSources}>
        <MediaThumbnailItem centered>
          <MediaThumbnailIcon name="play" />
        </MediaThumbnailItem>
        <MediaThumbnailItem centered bottom>
          <H6 padded>Play</H6>
        </MediaThumbnailItem>
      </StyledMediaThumbnail>
    </TouchableScale>
  </Container>
);

PlayButton.propTypes = {
  action: PropTypes.func,
  coverImageSources: PropTypes.arrayOf(PropTypes.shape({})),
};

export default PlayButton;
