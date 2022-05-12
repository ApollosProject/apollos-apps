import React, { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import { ApollosPlayerContainer } from '@apollosproject/ui-media-player';
import { named } from '@apollosproject/ui-kit/src/theme';
import { useTrack } from '@apollosproject/ui-analytics';
import { GET_MEDIA } from '../NodeSingleConnected';
import INTERACT_WITH_NODE from './interactWithNode';

const Noop = () => null;

const ApollosPlayerConnected = ({
  nodeId,
  Component,
  audioOnly,
  mediaSource,
  ...props
}) => {
  const [interactWithVideo] = useMutation(INTERACT_WITH_NODE);

  const track = useTrack();

  const { data } = useQuery(GET_MEDIA, {
    variables: { nodeId },
    fetchPolicy: 'cache-and-network',
  });

  const handleOnPlay = useCallback(
    ({ id, elapsedTime, title }) => {
      interactWithVideo({
        variables: {
          nodeId: id,
          action: 'VIEW',
          data: { field: 'progress', value: elapsedTime },
        },
      });
      track({
        eventName: 'Video Play',
        properties: {
          videoId: id,
          videoTitle: title,
        },
      });
    },
    [interactWithVideo, track]
  );
  const handleOnPause = useCallback(
    ({ id, elapsedTime, title }) => {
      interactWithVideo({
        variables: {
          nodeId: id,
          action: 'VIEW',
          data: { field: 'progress', value: elapsedTime },
        },
      });
      track({
        eventName: 'Video Pause',
        properties: {
          videoId: id,
          videoTitle: title,
        },
      });
    },
    [interactWithVideo, track]
  );
  const handleOnEnd = useCallback(
    ({ id, elapsedTime, title }) => {
      interactWithVideo({
        variables: {
          nodeId: id,
          action: 'VIEW',
          data: { field: 'progress', value: elapsedTime },
        },
      });
      track({
        eventName: 'Video End',
        properties: {
          videoId: id,
          videoTitle: title,
        },
      });
    },
    [interactWithVideo, track]
  );

  return (
    <ApollosPlayerContainer
      source={mediaSource}
      coverImage={data.node?.coverImage?.sources}
      presentationProps={{
        title: data?.node?.title,
      }}
      audioOnly={audioOnly}
      videos={data?.node?.videos}
      onPlay={handleOnPlay}
      onPause={handleOnPause}
      onEnd={handleOnEnd}
      playheadStart={data?.node?.videos[0]?.userProgress?.playhead}
      {...props}
    >
      <Component nodeId={nodeId} ImageWrapperComponent={Noop} {...props} />
    </ApollosPlayerContainer>
  );
};

ApollosPlayerConnected.propTypes = {
  nodeId: PropTypes.string,
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  audioOnly: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  mediaSource: PropTypes.object,
};

export default named('ui-connected.ApollosPlayerConnected')(
  ApollosPlayerConnected
);
