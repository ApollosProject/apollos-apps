import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import HorizontalCardListFeature from './HorizontalCardListFeature';
import GET_HORIZONTAL_CARD_LIST_FEATURE from './getHorizontalCardListFeature';

function HorizontalCardListFeatureConnected({
  featureId,
  Component,
  isLoading,
  ...props
}) {
  return (
    <Query query={GET_HORIZONTAL_CARD_LIST_FEATURE} variables={{ featureId }}>
      {({ data, loading }) => (
        <Component
          {...get(data, 'node')}
          cards={get(data, 'node.cards', []).map(({ actionIcon, ...card }) => ({
            ...card,
            ...(actionIcon != null ? { actionIcon: card.actionIcon } : {}), // temp hack because ContentCard doesn't handle null action icon well
            coverImage: get(card, 'coverImage.sources', undefined),
            __typename: card.relatedNode.__typename,
            id: card.relatedNode.id,
          }))}
          {...props}
          isLoading={loading || isLoading}
        />
      )}
    </Query>
  );
}

HorizontalCardListFeatureConnected.propTypes = {
  Component: PropTypes.node,
  isLoading: PropTypes.bool,
  featureId: PropTypes.string.isRequired,
};

HorizontalCardListFeatureConnected.defaultProps = {
  Component: HorizontalCardListFeature,
};

export default HorizontalCardListFeatureConnected;
