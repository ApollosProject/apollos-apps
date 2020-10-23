import React from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

import { styled, BackgroundView, StretchyView } from '@apollosproject/ui-kit';
import ContentNodeConnected from '../ContentNodeConnected';
import ContentParentFeedConnected from '../ContentParentFeedConnected';
import ContentChildFeedConnected from '../ContentChildFeedConnected';
import UpNextButtonConnected from '../UpNextButtonConnected';
import ContentSingleFeaturesConnected from '../ContentSingleFeaturesConnected';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const NodeSingleConnected = ({ nodeId }) => (
  <BackgroundView>
    <StretchyView>
      {({ Stretchy, ...scrollViewProps }) => (
        <FlexedScrollView {...scrollViewProps}>
          <ContentNodeConnected
            ImageWrapperComponent={Stretchy}
            nodeId={nodeId}
          />
          <ContentSingleFeaturesConnected nodeId={nodeId} />
          <UpNextButtonConnected nodeId={nodeId} />
          <ContentParentFeedConnected nodeId={nodeId} />
          <ContentChildFeedConnected nodeId={nodeId} />
        </FlexedScrollView>
      )}
    </StretchyView>
  </BackgroundView>
);

NodeSingleConnected.propTypes = {
  nodeId: PropTypes.string,
};

export default NodeSingleConnected;
