import React from 'react';
import PropTypes from 'prop-types';
import { H3, PaddedView } from '@apollosproject/ui-kit';
import TextFeature from './TextFeature';
import ScriptureFeature from './ScriptureFeature';

const FEATURE_MAP = {
  TextFeature,
  ScriptureFeature,
};

const ContentSingleFeatures = ({ contentId, isLoading }) => (
  <PaddedView horizontal={false}>
    <PaddedView vertical={false}>
      <H3 padded>Engage</H3>
    </PaddedView>
    {features.map(({ __typename, ...feature }) => {
      const Feature = FEATURE_MAP[__typename];
      if (!Feature) return null;
      return (
        <Feature
          key={feature.id}
          {...feature}
          contentId={contentId}
          isLoading={isLoading}
        />
      );
    })}
  </PaddedView>
);

ContentSingleFeatures.propTypes = {
  contentId: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default ContentSingleFeatures;
