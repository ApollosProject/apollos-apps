import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { H3, PaddedView } from '@apollosproject/ui-kit';
import TextFeature from '../TextFeature';
import ScriptureFeature from '../ScriptureFeature';

const featureMap = {
  TextFeature,
  ScriptureFeature,
};

const ContentSingleFeatures = memo(
  ({ contentId, features, isLoading, title }) => (
    <PaddedView horizontal={false}>
      <PaddedView vertical={false}>
        <H3 padded>{title}</H3>
      </PaddedView>
      {features.map(({ __typename, ...feature }) => {
        const Feature = featureMap[__typename];
        // if (!Feature) return null;
        return (
          (
            <Feature
              key={feature.id}
              {...feature}
              contentId={contentId}
              isLoading={isLoading}
            />
          ) || null
        );
      })}
    </PaddedView>
  )
);

ContentSingleFeatures.propTypes = {
  contentId: PropTypes.string,
  features: PropTypes.shape({
    id: PropTypes.string().isRequired,
    order: PropTypes.string(),
    __typename: PropTypes.string().isRequired,
  }),
  isLoading: PropTypes.bool,
  title: PropTypes.string,
};

ContentSingleFeatures.defaultProps = {
  title: 'Engage',
};

ContentSingleFeatures.displayName = 'ContentSingleFeatures';

export default ContentSingleFeatures;
