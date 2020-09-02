import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { H3, PaddedView, withIsLoading } from '@apollosproject/ui-kit';
import nodeFeaturesComponentMapper from '../nodeFeaturesComponentMapper';

const ContentSingleFeatures = memo(
  ({ features, title, additionalFeatures, nodeId }) => (
    <PaddedView horizontal={false}>
      {title && (
        <PaddedView vertical={false}>
          <H3 padded>{title}</H3>
        </PaddedView>
      )}
      {features.map((feature) =>
        nodeFeaturesComponentMapper({
          feature,
          additionalFeatures,
          nodeId,
        })
      )}
    </PaddedView>
  )
);

ContentSingleFeatures.propTypes = {
  features: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      order: PropTypes.string,
      __typename: PropTypes.string.isRequired,
    })
  ),
  featureMap: PropTypes.shape({}),
  additionalFeatures: PropTypes.shape({}),
  nodeId: PropTypes.string,
  title: PropTypes.string,
};

ContentSingleFeatures.defaultProps = {
  title: 'Engage',
  additionalFeatures: {},
};

ContentSingleFeatures.displayName = 'ContentSingleFeatures';

export default withIsLoading(ContentSingleFeatures);
