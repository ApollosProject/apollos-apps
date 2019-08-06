import React from 'react';
import PropTypes from 'prop-types';

import { ActionCard, BodyText } from '@apollosproject/ui-kit';
import ShareButton from 'apolloschurchapp/src/ui/ShareButton';

const TextFeature = ({ body, sharing: { message } = {}, contentId }) => (
  <ActionCard action={<ShareButton message={message} itemId={contentId} />}>
    <BodyText>{body}</BodyText>
  </ActionCard>
);

TextFeature.propTypes = {
  body: PropTypes.string.isRequired,
  sharing: PropTypes.shape({ message: PropTypes.string }),
  contentId: PropTypes.string.isRequired,
};

export const TEXT_FEATURE_FRAGMENT = `
fragment TextFeatureFragment on TextFeature {
  body
  id
  sharing {
    message
  }
}
`;

export default TextFeature;
