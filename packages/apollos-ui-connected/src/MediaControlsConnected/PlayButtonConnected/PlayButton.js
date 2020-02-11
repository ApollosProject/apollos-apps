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

const PlayButton = ({ coverImageSources, icon, onPress, title }) => (
  <Container>
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
