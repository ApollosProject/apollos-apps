import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  HorizontalDefaultCard,
  HorizontalHighlightCard,
  HTMLView,
} from '@apollosproject/ui-kit';

const cardMapper = ({ title, hyphenatedTitle, htmlContent, ...props }) => {
  // map typename to the the card we want to render.
  switch (get(props, '__typename')) {
    case 'MediaContentItem':
    case 'WeekendContentItem':
    case 'ContentSeriesContentItem':
    case 'DevotionalContentItem':
      return <HorizontalHighlightCard title={hyphenatedTitle} {...props} />;
    case 'Message':
      return <HTMLView>{htmlContent}</HTMLView>;
    default:
      return <HorizontalDefaultCard title={title} {...props} />;
  }
};

cardMapper.propTypes = {
  hyphenatedTitle: PropTypes.string,
  title: PropTypes.string,
};

export default cardMapper;
