import React from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';

import { styled, BackgroundView, StretchyView } from '@apollosproject/ui-kit';
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

const NodeSingleInner = ({ nodeId, ImageWrapperComponent }) => (
  <>
    <ContentNodeConnected
      ImageWrapperComponent={ImageWrapperComponent}
      nodeId={nodeId}
    />
    <ScriptureNodeConnected nodeId={nodeId} />
    <NodeFeaturesConnected nodeId={nodeId} />
    <UpNextButtonConnected nodeId={nodeId} />
    <ContentParentFeedConnected nodeId={nodeId} />
    <ContentChildFeedConnected nodeId={nodeId} />
  </>
);

NodeSingleInner.propTypes = {
  nodeId: PropTypes.string,
  ImageWrapperComponent: PropTypes.any, // eslint-disable-line
};

const NodeSingleConnected = ({ nodeId, children }) => (
  <BackgroundView>
    <StretchyView>
      {({ Stretchy, ...scrollViewProps }) => (
        <FlexedScrollView {...scrollViewProps}>
          <NodeSingleInner nodeId={nodeId} ImageWrapperComponent={Stretchy} />
        </FlexedScrollView>
      )}
    </StretchyView>
    {children}
  </BackgroundView>
);

NodeSingleConnected.propTypes = {
  nodeId: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

const NodeSingleConnectedWithMedia = ({ nodeId, children }) => (
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
          <NodeSingleConnected nodeId={nodeId}>{children}</NodeSingleConnected>
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
            <NodeSingleInner nodeId={nodeId} ImageWrapperComponent={Noop} />
          </ApollosPlayerContainer>
          {children}
        </BackgroundView>
      );
    }}
  </Query>
);

NodeSingleConnectedWithMedia.propTypes = {
  nodeId: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default NodeSingleConnectedWithMedia;
