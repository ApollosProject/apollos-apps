import React from 'react';
import PropTypes from 'prop-types';

import DefaultCard from './DefaultCard';
import HighlightCard from './HighlightCard';
import FeaturedCard from './FeaturedCard';
import HorizontalHighlightCard from './HorizontalHighlightCard';
import HorizontalDefaultCard from './HorizontalDefaultCard';

const SmartDefaultCard = ({ horizontal, ...props }) =>
  horizontal ? (
    <HorizontalDefaultCard {...props} />
  ) : (
    <DefaultCard {...props} />
  );

SmartDefaultCard.propTypes = {
  horizontal: PropTypes.bool,
};

const SmartHighlightCard = ({ horizontal, ...props }) =>
  horizontal ? (
    <HorizontalHighlightCard {...props} />
  ) : (
    <HighlightCard {...props} />
  );

SmartHighlightCard.propTypes = {
  horizontal: PropTypes.bool,
};

const ContentCard = ({
  __typename = null,
  type,
  horizontal,
  hyphenatedTitle,
  ...props
}) => {
  if (
    type === 'highlight' ||
    [
      'MediaContentItem',
      'WeekendContentItem',
      'ContentSeriesContentItem',
      'DevotionalContentItem',
    ].includes(__typename)
  )
    return (
      <SmartHighlightCard
        horizontal={horizontal}
        title={hyphenatedTitle}
        {...props}
      />
    );
  if (type === 'featured') return <FeaturedCard {...props} />;
  return <SmartDefaultCard horizontal={horizontal} {...props} />;
};

ContentCard.propTypes = {
  type: PropTypes.oneOf(['highlight', 'featured']),
  __typename: PropTypes.string,
  horizontal: PropTypes.bool,
  hyphenatedTitle: PropTypes.string,
};

ContentCard.defaultProps = { horizontal: false };

export default ContentCard;
