import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import FlexedView from '../FlexedView';
import styled from 'apolloschurchapp/src/ui/styled';

import CoverPlayer from './CoverPlayer';

const BackgroundView = styled(({ theme }) => ({
  backgroundColor: theme.colors.lightPrimary,
}))(FlexedView);

const getMediaPlayerVisibility = gql`
  query mediaPlayer {
    mediaPlayer @client {
      isVisible
    }
  }
`;

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
