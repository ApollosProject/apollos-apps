import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import CampaignItemListFeature from '../CampaignItemListFeature';
import VerticalCardListFeature from './VerticalCardListFeature';
import GET_VERTICAL_CARD_LIST_FEATURE from './getVerticalCardListFeature';

function VerticalCardListFeatureConnected({
  featureId,
  Component,
  FeaturedComponent,
  isFeatured,
  isLoading,
  ...props
}) {
  return (
    <Query query={GET_VERTICAL_CARD_LIST_FEATURE} variables={{ featureId }}>
      {({ data, loading }) => {
        const featured = get(data, 'node.isFeatured') || isFeatured;
        const ComponentToRender = featured ? FeaturedComponent : Component;
        return (
          <ComponentToRender
            {...get(data, 'node')}
            cards={get(data, 'node.cards', []).map(
              ({ actionIcon, ...card }) => ({
                ...card,
                ...(actionIcon != null ? { actionIcon: card.actionIcon } : {}), // temp hack because ContentCard doesn't handle null action icon well
                coverImage: get(card, 'coverImage.sources', undefined),
                __typename: card.relatedNode.__typename,
                id: card.relatedNode.id,
              })
            )}
            {...props}
            isLoading={loading || isLoading}
          />
        );
      }}
    </Query>
  );
}

VerticalCardListFeatureConnected.propTypes = {
  Component: PropTypes.node,
  FeaturedComponent: PropTypes.node,
  featureId: PropTypes.string.isRequired,
  isFeatured: PropTypes.bool,
  isLoading: PropTypes.bool,
};

VerticalCardListFeatureConnected.defaultProps = {
  Component: VerticalCardListFeature,
  FeaturedComponent: CampaignItemListFeature,
  isFeatured: false,
};

export {
  VerticalCardListFeatureConnected as default,
  GET_VERTICAL_CARD_LIST_FEATURE,
  VerticalCardListFeature,
};
