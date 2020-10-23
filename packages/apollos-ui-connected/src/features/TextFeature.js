import React from 'react';
import PropTypes from 'prop-types';

import { ActionCard, BodyText } from '@apollosproject/ui-kit';
import ShareButtonConnected from '../ShareButtonConnected';

const TextFeature = ({
  body,
  sharing: { message } = {},
  contentId,
  nodeId,
}) => (
  <ActionCard
    action={
      <ShareButtonConnected message={message} itemId={nodeId || contentId} />
    }
  >
    <BodyText>{body}</BodyText>
  </ActionCard>
);

TextFeature.propTypes = {
  body: PropTypes.string.isRequired,
  sharing: PropTypes.shape({ message: PropTypes.string }),
  contentId: PropTypes.string,
  nodeId: PropTypes.string,
};

export default TextFeature;
