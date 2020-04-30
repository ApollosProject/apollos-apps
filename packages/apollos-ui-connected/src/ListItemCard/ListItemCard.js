import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { ErrorCard } from '@apollosproject/ui-kit';

import { LiveConsumer } from '../live';

import listItemCardMapper from './listItemCardMapper';

const ListItemCard = memo(
  ({ Component, contentId, isLoading, tile, ...otherProps }) => {
    if (!contentId || isLoading)
      return <Component {...otherProps} isLoading tile={tile} />;

    return (
      <LiveConsumer contentId={contentId}>
        {(liveStream) => {
          if (error) return <ErrorCard error={error} />;

          const coverImage = get(node, 'coverImage.sources', undefined);
          const hasMedia = !!get(node, 'videos.[0].sources[0]', null);
          const isLive = !!(liveStream && liveStream.isLive);
          const labelText = get(node, 'parentChannel.name', '');

          return (
            <Component
              {...node}
              hasAction={hasMedia}
              isLive={isLive}
              labelText={isLive ? 'Live' : labelText}
              {...otherProps}
              coverImage={coverImage}
              isLoading={loading}
            />
          );
        }}
      </LiveConsumer>
    );
  }
);

ListItemCard.propTypes = {
  Component: PropTypes.func,
  contentId: PropTypes.string,
  isLoading: PropTypes.bool,
  tile: PropTypes.bool,
};

ListItemCard.defaultProps = {
  Component: listItemCardMapper,
};

ListItemCard.displayName = 'ListItemCard';

export default ListItemCard;
