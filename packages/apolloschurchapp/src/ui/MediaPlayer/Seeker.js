import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { get } from 'lodash';

import styled from 'apolloschurchapp/src/ui/styled';
import { H6 } from 'apolloschurchapp/src/ui/typography';

const TIME_TEXT_WIDTH = 50;

const getElapsedTime = gql`
  query {
    mediaPlayer @client {
      progress {
        currentTime
      }
    }
  }
`;

const getProgress = gql`
  query {
    mediaPlayer @client {
      progress {
        currentTime
        duration
      }
    }
  }
`;

const getTotalTime = gql`
  query {
    mediaPlayer @client {
      progress {
        duration
      }
    }
  }
`;

const Container = styled({
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})(View);

const TimeText = styled({
  width: TIME_TEXT_WIDTH,
  textAlign: 'center',
  alignItems: 'center',
})(H6);

const Track = styled(({ theme, minimal }) => ({
  backgroundColor: minimal
    ? theme.colors.darkTertiary
    : theme.colors.darkSecondary,
  height: minimal ? StyleSheet.hairlineWidth : theme.sizing.borderRadius,
  borderRadius: minimal ? 0 : theme.sizing.borderRadius,
  overflow: 'hidden',
  position: 'absolute',
  left: minimal ? 0 : TIME_TEXT_WIDTH,
  right: minimal ? 0 : TIME_TEXT_WIDTH,
}))(View);

const ProgressBar = styled(({ theme, progress }) => ({
  backgroundColor: theme.colors.secondary,
  ...StyleSheet.absoluteFillObject,
  width: `${progress * 100}%`,
}))(View);

class Seeker extends PureComponent {
  static propTypes = {
    minimal: PropTypes.bool,
    style: PropTypes.any, // eslint-disable-line
  };

  timestamp = (time) => {
    // Hours, minutes and seconds
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;

    let timestamp = '';

    if (hrs > 0) {
      timestamp += `${hrs}:${mins < 10 ? '0' : ''}`;
    }

    timestamp += `${mins}:${secs < 10 ? '0' : ''}`;
    timestamp += `${Math.round(secs)}`;
    return timestamp;
  };

  renderPlayhead = ({ data: { mediaPlayer } = {} }) => {
    const progress =
      get(mediaPlayer, 'progress.currentTime') /
      (get(mediaPlayer, 'progress.duration') || 1); // prevent division by 0;
    return <ProgressBar progress={progress} />;
  };

  renderElapsedTime = ({ data: { mediaPlayer } = {} }) => (
    <TimeText>
      {this.timestamp(get(mediaPlayer, 'progress.currentTime') || 0)}
    </TimeText>
  );

  renderTotalTime = ({ data: { mediaPlayer } = {} }) => (
    <TimeText>
      {this.timestamp(get(mediaPlayer, 'progress.duration') || 0)}
    </TimeText>
  );

  render() {
    return (
      <Container style={this.props.style}>
        {!this.props.minimal ? (
          <Query query={getElapsedTime}>{this.renderElapsedTime}</Query>
        ) : null}
        <Track minimal={this.props.minimal}>
          <Query query={getProgress}>{this.renderPlayhead}</Query>
        </Track>
        {!this.props.minimal ? (
          <Query query={getTotalTime}>{this.renderTotalTime}</Query>
        ) : null}
      </Container>
    );
  }
}

export default Seeker;
