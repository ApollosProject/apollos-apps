import * as React from 'react';

import { StyleSheet } from 'react-native';
import { InternalPlayerContext } from './context';
import { PortalOrigin } from './portals';

const VideoPresentationContainer = ({
  VideoComponent,
  useNativeFullscreeniOS,
  onEnd,
}: {
  VideoComponent?: React.FunctionComponent<{
    useNativeFullscreeniOS?: boolean;
    onEnd?: Function;
  }>;
  useNativeFullscreeniOS?: boolean;
  onEnd?: Function;
}) => {
  const { playerId } = React.useContext(InternalPlayerContext);

  if (!VideoComponent) return null;

  return (
    <PortalOrigin destination={playerId} style={StyleSheet.absoluteFill}>
      <VideoComponent
        useNativeFullscreeniOS={useNativeFullscreeniOS}
        onEnd={onEnd}
      />
    </PortalOrigin>
  );
};

export default VideoPresentationContainer;
