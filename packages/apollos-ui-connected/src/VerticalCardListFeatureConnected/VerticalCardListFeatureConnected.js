import React from 'react';
import { Query } from '@apollo/client/react/components';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import CampaignItemListFeature from '../CampaignItemListFeature';
import VerticalCardListFeature from './VerticalCardListFeature';
import GET_VERTICAL_CARD_LIST_FEATURE from './getVerticalCardListFeature';

const VerticalCardListFeatureConnected = ({
  featureId,
  Component,
  FeaturedComponent,
  isFeatured,
  isLoading,
  refetchRef,
  ...props
}) => (
  <Query
    query={GET_VERTICAL_CARD_LIST_FEATURE}
    variables={{ featureId }}
    fetchPolicy="cache-and-network"
  >
    {({ data, loading, refetch }) => {
      const featured = get(data, 'node.isFeatured') || isFeatured;
      const ComponentToRender = featured ? FeaturedComponent : Component;
      if (featureId && refetch && refetchRef)
        refetchRef({ refetch, id: featureId });
      return (
        <ComponentToRender
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

VerticalCardListFeatureConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  FeaturedComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  featureId: PropTypes.string.isRequired,
  isFeatured: PropTypes.bool,
  isLoading: PropTypes.bool,
  refetchRef: PropTypes.func,
};

VerticalCardListFeatureConnected.defaultProps = {
  Component: VerticalCardListFeature,
  FeaturedComponent: CampaignItemListFeature,
  isFeatured: false,
};

VerticalCardListFeatureConnected.displayName =
  'VerticalCardListFeatureConnected';

export default VerticalCardListFeatureConnected;
