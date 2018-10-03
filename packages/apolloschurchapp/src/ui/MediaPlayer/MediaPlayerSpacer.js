import React from 'react';
import { View } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { get } from 'lodash';
import DeviceInfo from 'react-native-device-info';

import { MINI_PLAYER_HEIGHT } from 'apolloschurchapp/src/ui/MediaPlayer';
import styled from 'apolloschurchapp/src/ui/styled';

const mediaPlayerIsVisibleQuery = gql`
  query {
    mediaPlayer @client {
      isVisible
    }
  }
`;

const isPhoneX = DeviceInfo.getModel() === 'iPhone X';

// Some devices need more "spacing" at the bottom of the screen. This helps account for that
const DEVICE_OFFSET = isPhoneX ? 10 : 0;

const Spacer = styled({
  paddingBottom: MINI_PLAYER_HEIGHT - DEVICE_OFFSET,
})(View);

const MediaPlayerSpacer = () => (
  <Query query={mediaPlayerIsVisibleQuery}>
    {({ data = {} }) =>
      get(data, 'mediaPlayer.isVisible') ? <Spacer /> : null
    }
  </Query>
);

export default MediaPlayerSpacer;
