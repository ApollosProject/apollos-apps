import React from 'react';
import { get } from 'lodash';

import {
  HorizontalDefaultCard,
  HorizontalHighlightCard,
} from '@apollosproject/ui-kit';

const horizontalContentCardComponentMapper = (props) => {
  // check if we have a custom Component prop to use or we'll use the default Component prop.
  let ComponentToRender;

  // map typename to the the card we want to render.
  switch (get(props, '__typename')) {
    case 'MediaContentItem':
      ComponentToRender = HorizontalHighlightCard;
      break;
    case 'WeekendContentItem':
      ComponentToRender = HorizontalHighlightCard;
      break;
    case 'ContentSeriesContentItem':
      ComponentToRender = HorizontalHighlightCard;
      break;
    case 'DevotionalContentItem':
      ComponentToRender = HorizontalHighlightCard;
      break;
    default:
      ComponentToRender = HorizontalDefaultCard;
      break;
  }

  return <ComponentToRender {...props} />;
};

export default horizontalContentCardComponentMapper;
