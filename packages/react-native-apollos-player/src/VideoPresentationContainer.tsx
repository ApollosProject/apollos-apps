import * as React from 'react';

import { StyleSheet } from 'react-native';
import { InternalPlayerContext } from './context';
import { PortalOrigin } from './portals';

const VideoPresentationContainer = ({
  VideoComponent,
}: {
  VideoComponent?: React.FunctionComponent;
}) => {
  const { playerId } = React.useContext(InternalPlayerContext);

  if (!VideoComponent) return null;

  return (
    <PortalOrigin destination={playerId} style={StyleSheet.absoluteFill}>
      <VideoComponent />
    </PortalOrigin>
  );
};

export default VideoPresentationContainer;
