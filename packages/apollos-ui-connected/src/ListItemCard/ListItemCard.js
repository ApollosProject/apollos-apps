import React, { memo } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { DefaultCard, HighlightCard } from '@apollosproject/ui-kit';

import listItemCardMapper from './listItemCardMapper';

const ListItemCard = memo(({ Component, ...props }) => {
  if (Component) return <Component {...props} />;

  switch (get(props, '__typename')) {
    case 'MediaContentItem':
    case 'WeekendContentItem':
    case 'ContentSeriesContentItem':
    case 'DevotionalContentItem':
      return <HighlightCard {...props} />;
    default:
      return <DefaultCard {...props} />;
  }
});

ListItemCard.propTypes = {
  Component: PropTypes.func,
};

ListItemCard.defaultProps = {
  Component: listItemCardMapper,
};

ListItemCard.displayName = 'ListItemCard';

export default ListItemCard;
