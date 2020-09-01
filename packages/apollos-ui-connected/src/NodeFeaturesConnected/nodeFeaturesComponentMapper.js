import React from 'react';
import PropTypes from 'prop-types';

import TextFeature from '../features/TextFeature';
import ScriptureFeature from '../features/ScriptureFeature';
import WebviewFeature from '../features/WebviewFeature';

const MAPPINGS = {
  TextFeature,
  ScriptureFeature,
  WebviewFeature,
};

const featuresFeedComponentMapper = ({
  feature,
  onPressActionItem,
  additionalFeatures = {},
  refetchRef,
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
        refetchRef={refetchRef}
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
  refetchRef: PropTypes.func.isRequired,
};

export default featuresFeedComponentMapper;
