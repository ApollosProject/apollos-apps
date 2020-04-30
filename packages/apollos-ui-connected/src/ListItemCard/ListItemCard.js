import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { ImageSourceType } from '@apollosproject/ui-kit';

import { LiveConsumer } from '../live';

import listItemCardMapper from './listItemCardMapper';

const ListItemCard = memo(
  ({ Component, contentId, labelText, ...cardProps }) => (
    <LiveConsumer contentId={contentId}>
      {(liveStream) => {
        const isLive = !!(liveStream && liveStream.isLive);

        return (
          <Component
            isLive={isLive}
            labelText={isLive ? 'Live' : labelText} // while `FeaturedCard` supports `isLive` by default other card types will now show "Live" in the label if that item is Live.
            {...cardProps}
          />
        );
      }}
    </LiveConsumer>
  )
);

ListItemCard.propTypes = {
  Component: PropTypes.func,
  contentId: PropTypes.string,
  // card props
  actionIcon: PropTypes.string,
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  hasAction: PropTypes.bool,
  isLiked: PropTypes.bool,
  LabelComponent: PropTypes.element,
  labelText: PropTypes.string,
  summary: PropTypes.string,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({}),
  }),
};

ListItemCard.defaultProps = {
  Component: listItemCardMapper,
};

ListItemCard.displayName = 'ListItemCard';

export default ListItemCard;
