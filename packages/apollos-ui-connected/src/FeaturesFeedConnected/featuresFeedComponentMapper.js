import React from 'react';
import PropTypes from 'prop-types';

import ActionListFeatureConnected from '../ActionListFeatureConnected';
import HorizontalCardListFeatureConnected from '../HorizontalCardListFeatureConnected';
import VerticalCardListFeatureConnected from '../VerticalCardListFeatureConnected';

const MAPPINGS = {
  ActionListFeature: ActionListFeatureConnected,
  HorizontalCardListFeature: HorizontalCardListFeatureConnected,
  VerticalCardListFeature: VerticalCardListFeatureConnected,
};

const featuresFeedComponentMapper = ({
  feature,
  onPressActionItem,
  additionalFeatures = {},
}) => {
  const { id, __typename, ...featureData } = feature;
  const map = { ...MAPPINGS, ...additionalFeatures };
  const Component = map[__typename];

  if (Component) {
    return (
      <Component
        featureId={id}
        onPressItem={onPressActionItem}
        listKey={id}
        {...featureData}
      />
    );
  }

  console.warn(
    `No feature found for ${__typename}. Do you need to pass it in via the additionalFeatures prop?`
  );
  return null;
};

featuresFeedComponentMapper.propTypes = {
  feature: PropTypes.shape({
    userFeedFeatures: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  onPressActionItem: PropTypes.func,
  additionalFeatures: PropTypes.shape({}),
};

export default featuresFeedComponentMapper;
