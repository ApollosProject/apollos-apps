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

      if (!hasMedia)
        return (
          <NodeSingleConnected nodeId={nodeId} {...props}>
            {children}
          </NodeSingleConnected>
        );
      return (
        <BackgroundView>
          <ApollosPlayerContainer
            source={data.node?.videos[0]?.sources[0]}
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

export default named('ui-connected.NodeSingleConnected')(
  NodeSingleConnectedWithMedia
);
