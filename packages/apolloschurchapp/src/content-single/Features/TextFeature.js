import React from 'react';
import PropTypes from 'prop-types';

import { ActionCard, BodyText } from '@apollosproject/ui-kit';
import ShareContentButtonConnected from 'apolloschurchapp/src/ui/ShareContentButtonConnected';

const TextFeature = ({ body, contentId }) => (
  <ActionCard
    action={<ShareContentButtonConnected title={body} itemId={contentId} />}
  >
    <BodyText>{body}</BodyText>
  </ActionCard>
);

TextFeature.propTypes = {
  body: PropTypes.string.isRequired,
  contentId: PropTypes.string.isRequired,
};

export const TEXT_FEATURE_FRAGMENT = `
fragment TextFeatureFragment on TextFeature {
  body
  id
}
`;

export default TextFeature;
