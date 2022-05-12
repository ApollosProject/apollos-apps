import React, { useMemo } from 'react';
import { View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import {
  styled,
  BackgroundView,
  StretchyViewExperimental as StretchyView,
  named,
} from '@apollosproject/ui-kit';

import ContentNodeConnected from '../ContentNodeConnected';
import ContentParentFeedConnected from '../ContentParentFeedConnected';
import ContentChildFeedConnected from '../ContentChildFeedConnected';
import UpNextButtonConnected from '../UpNextButtonConnected';
import NodeFeaturesConnected from '../NodeFeaturesConnected';
import ScriptureNodeConnected from '../ScriptureNodeConnected';
import ApollosPlayerConnected from '../ApollosPlayerConnected';

import GET_MEDIA from './getMedia';
import GET_TITLE from './getTitle';

const FlexedScrollView = styled({ flex: 1 })(Reanimated.ScrollView);
const NodeSingleInner = ({ nodeId, ImageWrapperComponent, ...props }) => (
  <View {...props}>
    <ContentNodeConnected
      ImageWrapperComponent={ImageWrapperComponent}
      nodeId={nodeId}
    />
    <ScriptureNodeConnected nodeId={nodeId} />
    <NodeFeaturesConnected nodeId={nodeId} />
    <UpNextButtonConnected nodeId={nodeId} />
    <ContentParentFeedConnected nodeId={nodeId} />
    <ContentChildFeedConnected nodeId={nodeId} />
  </View>
);

NodeSingleInner.propTypes = {
  nodeId: PropTypes.string,
  ImageWrapperComponent: PropTypes.any, // eslint-disable-line
};

const NodeSingleConnected = ({ nodeId, children, Component, ...props }) => (
  <>
    <BackgroundView>
      <StretchyView>
        {({ Stretchy, ...scrollViewProps }) => (
          <FlexedScrollView {...scrollViewProps}>
            {nodeId ? (
              <Component
                nodeId={nodeId}
                ImageWrapperComponent={Stretchy}
                {...props}
              />
            ) : null}
          </FlexedScrollView>
        )}
      </StretchyView>
    </BackgroundView>
    {children}
  </>
);

NodeSingleConnected.propTypes = {
  nodeId: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

NodeSingleConnected.defaultProps = {
  Component: NodeSingleInner,
};

const NodeSingleConnectedWithMedia = ({
  nodeId,
  children,
  Component,
  ...props
}) => {
  const { data } = useQuery(GET_MEDIA, {
    variables: { nodeId },
    fetchPolicy: 'cache-and-network',
  });

  const hasVideo =
    data?.node?.videos?.length &&
    data.node.videos.some(({ sources }) => sources.length);

  const hasAudio =
    data?.node?.audios?.length &&
    data.node.audios.some(({ sources }) => sources.length);

  const hasLivestream =
    data?.node?.liveStream?.isLive &&
    data?.node?.liveStream?.media?.sources?.length;

  const mediaSource = useMemo(() => {
    if (hasLivestream) return data?.node?.liveStream?.media?.sources[0];

    if (hasVideo) {
      const video = data?.node?.videos?.find(({ sources }) => sources?.length);
      return {
        ...video.sources[0],
        // if there's an embed code, pass it ot the media player and it'll choose the best path to use:
        ...(video.embedHtml ? { html: video.embedHtml } : {}),
      };
    }

    if (hasAudio) {
      return data?.node?.audios?.find(({ sources }) => sources?.length)
        ?.sources[0];
    }

    return null;
  }, [data, hasLivestream, hasVideo, hasAudio]);

  if (!mediaSource)
    return (
      <NodeSingleConnected nodeId={nodeId} Component={Component} {...props}>
        {children}
      </NodeSingleConnected>
    );

  return (
    <BackgroundView>
      <ApollosPlayerConnected
        nodeId={nodeId}
        mediaSource={mediaSource}
        Component={Component}
        audioOnly={!hasLivestream && !hasVideo && hasAudio}
      >
        {children}
      </ApollosPlayerConnected>
    </BackgroundView>
  );
};

NodeSingleConnectedWithMedia.propTypes = {
  nodeId: PropTypes.string,
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

NodeSingleConnectedWithMedia.defaultProps = {
  Component: NodeSingleInner,
};

export { GET_MEDIA, GET_TITLE };

export default named('ui-connected.NodeSingleConnected')(
  NodeSingleConnectedWithMedia
);
