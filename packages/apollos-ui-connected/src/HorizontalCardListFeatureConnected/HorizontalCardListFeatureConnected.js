import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import HorizontalCardListFeature from './HorizontalCardListFeature';
import GET_HORIZONTAL_CARD_LIST_FEATURE from './getHorizontalCardListFeature';

const HorizontalCardListFeatureConnected = ({
  Component,
  featureId,
  isLoading,
  refetchRef,
  ...props
}) => (
  <Query
    query={GET_HORIZONTAL_CARD_LIST_FEATURE}
    fetchPolicy="cache-and-network"
    variables={{ featureId }}
  >
    {({ data, loading, refetch }) => {
      if (featureId && refetch && refetchRef)
        refetchRef({ refetch, id: featureId });
      return (
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
      );
    }}
  </Query>
);

HorizontalCardListFeatureConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  refetchRef: PropTypes.func,
};

HorizontalCardListFeatureConnected.defaultProps = {
  Component: HorizontalCardListFeature,
};

export default HorizontalCardListFeatureConnected;
