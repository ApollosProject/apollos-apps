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

class MediaPlayer extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  renderPlayer = ({ data = {} }) => {
    if (!data.mediaPlayer || !data.mediaPlayer.isVisible) return null;
    return <CoverPlayer />;
  };

  render() {
    return (
      <BackgroundView>
        {this.props.children}
        <Query query={getMediaPlayerVisibility}>{this.renderPlayer}</Query>
      </BackgroundView>
    );
  }
}

export default MediaPlayer;
