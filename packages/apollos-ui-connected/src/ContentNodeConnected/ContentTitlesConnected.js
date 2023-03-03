import React from 'react';
import PropTypes from 'prop-types';
import { ContentTitles } from '@apollosproject/ui-kit';

import { useLike } from '../LikeButtonConnected';
import { useShare } from '../ShareButtonConnected';

const ContentTitlesConnected = ({ node }) => {
  const [isLiked, like] = useLike(node?.id);
  const share = useShare(node?.id);
  return (
    <ContentTitles
      title={node?.title}
      summary={node?.summary}
      featured
      isLiked={isLiked}
      onPressLike={like}
      onPressShare={share}
    />
  );
};

ContentTitlesConnected.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    summary: PropTypes.string,
  }),
};

export default ContentTitlesConnected;
