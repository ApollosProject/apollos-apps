import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import ActionListFeature from '../ActionListFeature';
import CampaignItemListFeature from '../CampaignItemListFeature';
import HorizontalCardListFeature from '../HorizontalCardListFeature';
import VerticalCardListFeature from '../VerticalCardListFeature';

const FeaturesFeed = ({
  features,
  isLoading,
  onPressActionItem,
  onPressCardActionButton,
}) =>
  get(features, 'userFeedFeatures', []).map(
    ({
      actions,
      cards,
      id,
      isFeatured,
      subtitle,
      title,
      __typename,
      ...props
    }) => {
      switch (__typename) {
        case 'ActionListFeature':
          return (
            <ActionListFeature
              // TODO: How can we better handle generating a loading state.
              actions={actions}
              isLoading={isLoading}
              onPressActionItem={onPressActionItem}
              onPressActionListButton={onPressCardActionButton}
              subtitle={subtitle}
              title={title}
              {...props}
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
  features: PropTypes.arrayOf(PropTypes.shapes()),
  isLoading: PropTypes.bool,
  onPressActionItem: PropTypes.func,
  onPressCardActionButton: PropTypes.func,
};

export default FeaturesFeed;
