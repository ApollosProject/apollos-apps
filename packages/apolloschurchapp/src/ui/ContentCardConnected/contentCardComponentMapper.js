import React from 'react';
import { get } from 'lodash';

import { DefaultCard, HighlightCard } from '@apollosproject/ui-kit';

const contentCardComponentMapper = (props) => {
  // check if we have a custom Component prop to use or we'll use the default Component prop.
  let ComponentToRender;

  // map typename to the the card we want to render.
  switch (get(props, '__typename')) {
    case 'MediaContentItem':
      ComponentToRender = HighlightCard;
      break;
    case 'WeekendContentItem':
      ComponentToRender = HighlightCard;
      break;
    case 'ContentSeriesContentItem':
      ComponentToRender = HighlightCard;
      break;
    case 'DevotionalContentItem':
      ComponentToRender = HighlightCard;
      break;
    default:
      ComponentToRender = DefaultCard;
      break;
  }

  return <ComponentToRender {...props} />;
};

export default contentCardComponentMapper;
