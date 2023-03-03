import * as React from 'react';
import { PortalDestination } from './portals';

import { InternalPlayerContext } from './context';

let playerIdCount = 0;

// Internal state store of all "players" (VideoOutlet components) that are
// currently rendered. TODO: future version might benefit from using context
let players: Array<string> = [];

const VideoOutlet: React.FunctionComponent = () => {
  const { setPlayerId } = React.useContext(InternalPlayerContext);

  const playerId = React.useMemo(() => {
    playerIdCount += 1;
    return `videoOutlet-${playerIdCount}`;
  }, []);

  React.useEffect(() => {
    // On mount: Sets this component as the active player
    players.push(playerId);
    setPlayerId(playerId);
    return () => {
      // On unmount: Sets next component up in render tree as active player
      players = players.slice(0, players.indexOf(playerId));
      setPlayerId(players[players.length - 1]);
    };
    // this effect needs to be a true "componentDidMount" effect, and never
    // run again (running on re-render would affect where video is portaled)
    // So therefore - we disable exhaustive-deps and pass empty array.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <PortalDestination name={playerId} />;
};

export default VideoOutlet;
