import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { ErrorCard, DefaultCard, HighlightCard } from '@apollosproject/ui-kit';
import GET_CONTENT_CARD from './query';

const ContentCardConnected = memo(
  ({ Component, contentId, isLoading, tile, ...otherProps }) => {
    if (!contentId || isLoading)
      return <Component {...otherProps} isLoading tile={tile} />;

    return (
      <Query query={GET_CONTENT_CARD} variables={{ contentId, tile: !!tile }}>
        {({ data: { node = {} } = {}, loading, error }) => {
          if (error) return <ErrorCard error={error} />;

          // check if we have a custom Component prop to use or we'll use the default Component prop.
          let ComponentToRender = Component;

          // map typename to the the card we want to render.
          switch (get(node, '__typename')) {
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

          const metrics = [
            {
              icon: node.isLiked ? 'like-solid' : 'like',
              value: node.likedCount,
            },
          ];

          const coverImage = get(node, 'coverImage.sources', undefined);

          return (
            <ComponentToRender
              {...node}
              {...otherProps}
              coverImage={coverImage}
              metrics={metrics}
              tile={tile}
              isLoading={loading}
            />
          );
        }}
      </Query>
    );
  }
);

ContentCardConnected.propTypes = {
  Component: PropTypes.element,
  contentId: PropTypes.string,
  isLoading: PropTypes.bool,
  tile: PropTypes.bool,
};

ContentCardConnected.defaultProps = {
  Component: DefaultCard,
};

export default ContentCardConnected;
