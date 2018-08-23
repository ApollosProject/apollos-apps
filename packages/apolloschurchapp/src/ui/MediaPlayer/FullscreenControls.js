import { get } from 'https';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { StyleSheet } from 'react-native';
import { Query, withApollo } from 'react-apollo';
import LinearGradient from 'react-native-linear-gradient';
import SafeAreaView from 'react-native-safe-area-view';

import PaddedView from '../PaddedView';
import { withTheme } from '../theme';
import styled from '../styled';
import { H3, H6 } from '../typography';

const Background = withTheme(({ theme }) => ({
  style: StyleSheet.absoluteFill,
  colors: [
    theme.colors.darkPrimary,
    theme.colors.transparent,
    theme.colors.darkPrimary,
  ],
  locations: [0, 0.3, 0.8],
}))(LinearGradient);

const Titles = styled({
  alignItems: 'center',
  paddingVertical: 0,
})(PaddedView);

const Title = styled({ textAlign: 'center' })(H3);
const Artist = styled({ textAlign: 'center' })(H6);

const getControlState = gql`
  query {
    mediaPlayer @client {
      isPlaying
      currentTrack {
        id
        title
        artist
      }
    }
  }
`;

const exitFullscreen = gql`
  mutation {
    mediaPlayerUpdateState(isFullscreen: false) @client
  }
`;

const pause = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: false) @client
  }
`;

const play = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: true) @client
  }
`;

class FullscreenControls extends PureComponent {
  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func,
    }),
  };

  handleClose = () => {
    this.props.client.mutate({ mutation: exitFullscreen });
  };

  handlePlay = () => {
    this.props.client.mutate({ mutation: play });
  };

  handlePause = () => {
    this.props.client.mutate({ mutation: pause });
  };

  renderFullscreenControls = ({ data: { mediaPlayer = {} } = {} }) => (
    <Background>
      <SafeAreaView
        style={StyleSheet.absoluteFill}
        forceInset={{ top: 'always', bottom: 'always' }}
      >
        <Titles>
          <Title>{get(mediaPlayer, 'currentTrack.title')}</Title>
          <Artist>{get(mediaPlayer, 'currentTrack.artist')}</Artist>
        </Titles>
      </SafeAreaView>
    </Background>
  );

  render() {
    return (
      <Query query={getControlState}>{this.renderFullscreenControls}</Query>
    );
  }
}

export default withApollo(FullscreenControls);
