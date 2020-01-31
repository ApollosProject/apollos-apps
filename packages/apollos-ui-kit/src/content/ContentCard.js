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
  coverImage,
  isLive,
  parentChannel,
  videos,
  ...props
}) => {
  const source = coverImage && coverImage.sources;
  const hasMedia = videos && videos.length && videos[0].sources.length > 0;
  const channelName = parentChannel && parentChannel.name;
  if (type === 'featured')
    return (
      <FeaturedCard
        coverImage={source}
        isLive={isLive}
        labelText={isLive ? 'Live' : channelName}
        hasAction={hasMedia}
        {...props}
      />
    );
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
        coverImage={source}
        labelText={channelName}
        hasAction={hasMedia}
        {...props}
      />
    );
  return (
    <SmartDefaultCard
      horizontal={horizontal}
      coverImage={source}
      labelText={channelName}
      {...props}
    />
  );
};

ContentCard.propTypes = {
  type: PropTypes.oneOf(['highlight', 'featured']),
  __typename: PropTypes.string,
  horizontal: PropTypes.bool,
  hyphenatedTitle: PropTypes.string,
  coverImage: PropTypes.shape({
    sources: PropTypes.arrayOf(PropTypes.shape({ uri: PropTypes.string })),
  }),
  isLive: PropTypes.bool,
  parentChannel: PropTypes.shape({ name: PropTypes.string }),
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      sources: PropTypes.arrayOf({ uri: PropTypes.string }),
    })
  ),
};

ContentCard.defaultProps = {
  horizontal: false,
  isLive: false,
};

export default ContentCard;
