import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { H3, PaddedView, withIsLoading } from '@apollosproject/ui-kit';
import TextFeature from '../../features/TextFeature';
import ScriptureFeature from '../../features/ScriptureFeature';
import WebviewFeature from '../../features/WebviewFeature';

const FEATURE_MAP = {
  TextFeature,
  ScriptureFeature,
  WebviewFeature,
};

const ContentSingleFeatures = memo(
  ({ contentId, features, isLoading, title, featureMap }) => (
    <PaddedView horizontal={false}>
      <PaddedView vertical={false}>
        <H3 padded>{title}</H3>
      </PaddedView>
      {features.map(({ __typename, ...feature }) => {
        const Feature = featureMap[__typename];
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
  )
);

ContentSingleFeatures.propTypes = {
  contentId: PropTypes.string,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      order: PropTypes.string,
      __typename: PropTypes.string.isRequired,
    })
  ),
  featureMap: PropTypes.shape({}),
  isLoading: PropTypes.bool,
  title: PropTypes.string,
};

ContentSingleFeatures.defaultProps = {
  title: 'Engage',
  featureMap: FEATURE_MAP,
};

ContentSingleFeatures.displayName = 'ContentSingleFeatures';

export default withIsLoading(ContentSingleFeatures);
