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

const Container = styled(
  {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  'ui-connected.MediaControlsConnected.PlayButtonConnected.PlayButton.Container'
)(View);

const StyledMediaThumbnail = styled(
  { marginVertical: 0 },
  'ui-connected.MediaControlsConnected.PlayButtonConnected.PlayButton.StyledMediaThumbnail'
)(MediaThumbnail);

const PlayButton = ({ coverImageSources, icon, onPress, title, ...props }) => (
  <Container {...props}>
    <TouchableScale onPress={onPress}>
      <StyledMediaThumbnail image={coverImageSources}>
        <MediaThumbnailItem centered>
          <MediaThumbnailIcon name={icon} />
        </MediaThumbnailItem>
        <MediaThumbnailItem centered bottom>
          <H6 padded>{title}</H6>
        </MediaThumbnailItem>
      </StyledMediaThumbnail>
    </TouchableScale>
  </Container>
);

PlayButton.propTypes = {
  coverImageSources: PropTypes.arrayOf(PropTypes.shape({})),
  icon: PropTypes.string,
  onPress: PropTypes.func,
  title: PropTypes.string,
};

PlayButton.defaultProps = {
  icon: 'play',
  title: 'Play',
};

export default PlayButton;
