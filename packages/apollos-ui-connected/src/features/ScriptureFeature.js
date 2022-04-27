import React from 'react';
import PropTypes from 'prop-types';

import { ActionCard, PaddedView, named } from '@apollosproject/ui-kit';
import { ScriptureItem } from '@apollosproject/ui-scripture';
import ShareButtonConnected from '../ShareButtonConnected';

const ScriptureFeature = ({
  contentId,
  featureId,
  isCard,
  isLoading,
  nodeId,
  scriptures,
  sharing: { message } = {},
  showShareButton,
  title,
}) => {
  const Wrapper = (
    { children } // eslint-disable-line react/prop-types
  ) =>
    // eslint-disable-next-line no-nested-ternary
    isCard ? (
      showShareButton ? (
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
          {children}
        </ActionCard>
      ) : (
        <ActionCard label={title} icon={'text'}>
          {children}
        </ActionCard>
      )
    ) : (
      <PaddedView>{children}</PaddedView>
    );

  return (
    <Wrapper>
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
    </Wrapper>
  );
};

ScriptureFeature.defaultProps = {
  isCard: true,
  showShareButton: true,
};

ScriptureFeature.propTypes = {
  isCard: PropTypes.bool,
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
  showShareButton: PropTypes.bool,
};

export default named('ui-connected.ScriptureFeature')(ScriptureFeature);
