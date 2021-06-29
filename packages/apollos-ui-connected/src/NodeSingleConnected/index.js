import React from 'react';
import { Animated, View } from 'react-native';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';

import {
  styled,
  BackgroundView,
  StretchyView,
  named,
} from '@apollosproject/ui-kit';
import { ApollosPlayerContainer } from '@apollosproject/ui-media-player';

import ContentNodeConnected from '../ContentNodeConnected';
import ContentParentFeedConnected from '../ContentParentFeedConnected';
import ContentChildFeedConnected from '../ContentChildFeedConnected';
import UpNextButtonConnected from '../UpNextButtonConnected';
import NodeFeaturesConnected from '../NodeFeaturesConnected';
import ScriptureNodeConnected from '../ScriptureNodeConnected';

import GET_MEDIA from './getMedia';
import GET_TITLE from './getTitle';

const Noop = () => null;

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

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
            <Component
              nodeId={nodeId}
              ImageWrapperComponent={Stretchy}
              {...props}
            />
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
}) => (
  <Query
    query={GET_MEDIA}
    variables={{ nodeId }}
    fetchPolicy={'cache-and-network'}
  >
    {({ data = {} }) => {
      const hasMedia =
        data?.node?.videos?.length &&
        data.node.videos.some(({ sources }) => sources.length);

      const hasLivestream =
        data?.node?.liveStream?.isLive &&
        data?.node?.liveStream?.media?.sources?.length;

      if (!hasMedia && !hasLivestream)
        return (
          <NodeSingleConnected nodeId={nodeId} Component={Component} {...props}>
            {children}
          </NodeSingleConnected>
        );

      const mediaSource = hasLivestream
        ? data.node?.liveStream?.media?.sources[0]
        : data.node?.videos?.find(({ sources }) => sources.length)?.sources[0];

      return (
        <BackgroundView>
          <ApollosPlayerContainer
            source={mediaSource}
            coverImage={data.node?.coverImage?.sources}
            presentationProps={{
              title: data.node.title,
            }}
          >
            <Component
              nodeId={nodeId}
              ImageWrapperComponent={Noop}
              {...props}
            />
          </ApollosPlayerContainer>
          {children}
        </BackgroundView>
      );
    }}
  </Query>
);

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
