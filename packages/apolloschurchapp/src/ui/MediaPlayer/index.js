import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import FlexedView from 'apolloschurchapp/src/ui/FlexedView';
import styled from 'apolloschurchapp/src/ui/styled';

import CoverPlayer from './CoverPlayer';

import { getMediaPlayerVisibility } from './queries';

const BackgroundView = styled(({ theme }) => ({
  backgroundColor: theme.colors.lightPrimary,
}))(FlexedView);

/**
 * Renders a CoverPlayer fixed below children:
 *  ____________________
 * |                    |
 * |                    |
 * |                    |
 * |     children       |
 * |                    |
 * |                    |
 * |____________________|
 * |                    |
 * |    CoverPlayer     |
 * |____________________|
 */
class MediaPlayer extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  renderPlayer = ({ data = {} }) => {
    const playerIsVisible = !(!data.mediaPlayer || !data.mediaPlayer.isVisible);
    const { isFullscreen } = data && data.mediaPlayer;
    return [
      <BackgroundView
        key="children"
        removeClippedSubviews={isFullscreen}
        renderToHardwareTextureAndroid={isFullscreen}
      >
        {this.props.children}
      </BackgroundView>,
      playerIsVisible ? <CoverPlayer key="cover" /> : null,
    ];
  };

  render() {
    return (
      <BackgroundView>
        <Query query={getMediaPlayerVisibility}>{this.renderPlayer}</Query>
      </BackgroundView>
    );
  }
}

export default MediaPlayer;
