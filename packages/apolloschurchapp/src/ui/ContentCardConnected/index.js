import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { DefaultCard, ErrorCard } from '@apollosproject/ui-kit';
import GET_CONTENT_CARD from './query';

export { TILE_CARD_FRAGMENT, LARGE_CARD_FRAGMENT } from './query';

const ContentCardConnected = memo(
  ({ Component, contentId, isLoading, tile, ...otherProps }) => {
    if (!contentId || isLoading)
      return <Component {...otherProps} isLoading tile={tile} />;

    return (
      <Query query={GET_CONTENT_CARD} variables={{ contentId, tile: !!tile }}>
        {({ data: { node = {} } = {}, loading, error }) => {
          if (error) return <ErrorCard error={error} />;

          const metrics = [
            {
              icon: node.isLiked ? 'like-solid' : 'like',
              value: node.likedCount,
            },
          ];

          const coverImage = get(node, 'coverImage.sources', undefined);

          return (
            <Component
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
