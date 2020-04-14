import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import ActionListFeature from '../ActionListFeature';
import CampaignItemListFeature from '../CampaignItemListFeature';
import HorizontalCardListFeature from '../HorizontalCardListFeature';
import VerticalCardListFeature from '../VerticalCardListFeature';

const FeaturesFeed = ({ features, isLoading, onPressActionItem }) =>
  get(features, 'userFeedFeatures', []).map(
    ({ actions, cards, id, isFeatured, subtitle, title, __typename }) => {
      switch (__typename) {
        case 'ActionListFeature':
          return (
            <ActionListFeature
              // TODO: How can we better handle generating a loading state.
              actions={actions}
              isLoading={isLoading}
              onPressActionItem={onPressActionItem}
              subtitle={subtitle}
              title={title}
            />
          );
        case 'HorizontalCardListFeature':
          return (
            <HorizontalCardListFeature
              cards={cards.map(({ actionIcon, ...card }) => ({
                ...card,
                ...(actionIcon != null ? { actionIcon: card.actionIcon } : {}),
                coverImage: get(card, 'coverImage.sources', undefined),
                __typename: card.relatedNode.__typename,
                id: card.relatedNode.id,
              }))}
              isLoading={isLoading}
              listKey={id}
              onPressItem={onPressActionItem}
              subtitle={subtitle}
            />
          );
        case 'VerticalCardListFeature': // eslint-disable-line no-case-declarations
          const Component = isFeatured
            ? CampaignItemListFeature
            : VerticalCardListFeature;
          return (
            <Component
              cards={cards.map(({ actionIcon, ...card }) => ({
                ...card,
                ...(actionIcon != null ? { actionIcon: card.actionIcon } : {}),
                coverImage: get(card, 'coverImage.sources', undefined),
                __typename: card.relatedNode.__typename,
                id: card.relatedNode.id,
              }))}
              isLoading={isLoading}
              listKey={id}
              onPressItem={onPressActionItem}
              subtitle={subtitle}
              title={title}
            />
          );
        default:
          return null;
      }
    }
  );

FeaturesFeed.proptypes = {
  features: PropTypes.shape({
    userFeedFeatures: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  isLoading: PropTypes.bool,
  onPressActionItem: PropTypes.func,
};

export default FeaturesFeed;
