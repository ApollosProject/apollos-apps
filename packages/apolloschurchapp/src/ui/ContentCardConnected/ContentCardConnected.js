import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { ErrorCard } from '@apollosproject/ui-kit';

import contentCardComponentMapper from './contentCardComponentMapper';
import GET_CONTENT_CARD from './query';

// returns an empty function;
const defaultMapProps = () => ({});

const ContentCardConnected = memo(
  ({ Component, contentId, isLoading, tile, mapProps, ...otherProps }) => {
    if (!contentId || isLoading)
      return <Component {...otherProps} isLoading tile={tile} />;

    return (
      <Query query={GET_CONTENT_CARD} variables={{ contentId }}>
        {({ data: { node = {} } = {}, loading, error }) => {
          if (error) return <ErrorCard error={error} />;

          const coverImage = get(node, 'coverImage.sources', undefined);

          const additionalProps = mapProps(node);

          return (
            <Component
              {...node}
              {...otherProps}
              {...additionalProps}
              coverImage={coverImage}
              isLoading={loading}
            />
          );
        }}
      </Query>
    );
  }
);

ContentCardConnected.propTypes = {
  Component: PropTypes.func,
  mapProps: PropTypes.func,
  contentId: PropTypes.string,
  isLoading: PropTypes.bool,
  tile: PropTypes.bool,
};

ContentCardConnected.defaultProps = {
  Component: contentCardComponentMapper,
  mapProps: defaultMapProps,
};

ContentCardConnected.displayName = 'ContentCardConnected';

export default ContentCardConnected;
