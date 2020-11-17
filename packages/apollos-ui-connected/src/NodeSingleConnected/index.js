import React from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import { styled, BackgroundView, StretchyView } from '@apollosproject/ui-kit';
import { ApollosPlayerContainer } from '@apollosproject/react-native-apollos-player';

import ContentNodeConnected from '../ContentNodeConnected';
import ContentParentFeedConnected from '../ContentParentFeedConnected';
import ContentChildFeedConnected from '../ContentChildFeedConnected';
import UpNextButtonConnected from '../UpNextButtonConnected';
import ContentSingleFeaturesConnected from '../ContentSingleFeaturesConnected';

import GET_MEDIA from './getMedia';

const Noop = () => null;

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const NodeSingleInner = ({ nodeId, ImageWrapperComponent }) => (
  <>
    <ContentNodeConnected
      MediaControlsComponent={Noop}
      ImageWrapperComponent={ImageWrapperComponent}
      nodeId={nodeId}
    />
    <ContentSingleFeaturesConnected nodeId={nodeId} />
    <UpNextButtonConnected nodeId={nodeId} />
    <ContentParentFeedConnected nodeId={nodeId} />
    <ContentChildFeedConnected nodeId={nodeId} />
  </>
);

NodeSingleInner.propTypes = {
  nodeId: PropTypes.string,
  ImageWrapperComponent: PropTypes.any, // eslint-disable-line
};

const NodeSingleConnected = ({ nodeId }) => (
  <BackgroundView>
    <StretchyView>
      {({ Stretchy, ...scrollViewProps }) => (
        <FlexedScrollView {...scrollViewProps}>
          <NodeSingleInner nodeId={nodeId} ImageWrapperComponent={Stretchy} />
        </FlexedScrollView>
      )}
    </StretchyView>
  </BackgroundView>
);

NodeSingleConnected.propTypes = {
  nodeId: PropTypes.string,
};

const NodeSingleConnectedWithMedia = ({ nodeId }) => (
  <Query
    query={GET_MEDIA}
    variables={{ nodeId }}
    fetchPolicy={'cache-and-network'}
  >
    {({ data = {} }) => {
      if (!data?.node?.videos?.length)
        return <NodeSingleConnected nodeId={nodeId} />;

      return (
        <ApollosPlayerContainer source={data.node.videos[0].sources[0]}>
          <NodeSingleInner nodeId={nodeId} ImageWrapperComponent={Noop} />
        </ApollosPlayerContainer>
      );
    }}
  </Query>
);

NodeSingleConnectedWithMedia.propTypes = {
  nodeId: PropTypes.string,
};

export default NodeSingleConnectedWithMedia;
