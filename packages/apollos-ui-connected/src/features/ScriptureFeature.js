import React from 'react';
import PropTypes from 'prop-types';

import { ActionCard } from '@apollosproject/ui-kit';
import { ScriptureItem } from '@apollosproject/ui-scripture';
import ShareButtonConnected from '../ShareButtonConnected';

const ScriptureFeature = ({
  scriptures,
  sharing: { message } = {},
  title,
  isLoading,
  contentId,
  nodeId,
  featureId,
}) => (
  <ActionCard
    label={title}
    icon={'text'}
    action={
      <ShareButtonConnected
        message={message}
        itemId={nodeId || contentId || featureId}
      />
    }
  >
    {scriptures.map(({ copyright, reference, html, id, version }) => (
      <ScriptureItem
        key={id}
        reference={reference}
        html={html}
        isLoading={isLoading}
        copyright={copyright}
        version={version}
      />
    ))}
  </ActionCard>
);

ScriptureFeature.propTypes = {
  isLoading: PropTypes.bool,
  scriptures: PropTypes.arrayOf(
    PropTypes.shape({
      html: PropTypes.string.isRequired,
      reference: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      copyright: PropTypes.string,
      version: PropTypes.string,
    })
  ),
  sharing: PropTypes.shape({ message: PropTypes.string }),
  contentId: PropTypes.string,
  title: PropTypes.string,
  nodeId: PropTypes.string,
  featureId: PropTypes.string,
};

export default ScriptureFeature;
