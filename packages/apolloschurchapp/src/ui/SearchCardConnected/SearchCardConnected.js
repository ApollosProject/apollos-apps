import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import { ErrorCard } from '@apollosproject/ui-kit';

import searchCardComponentMapper from './searchCardComponentMapper';
import GET_CONTENT_CARD from './query';

const SearchCardConnected = memo(
  ({
    Component,
    contentId,
    isLoading,
    title,
    summary,
    coverImage,
    ...otherProps
  }) => {
    if (!contentId || isLoading) return <Component {...otherProps} isLoading />;

    return (
      <Query query={GET_CONTENT_CARD} variables={{ contentId }}>
        {({ data: { node = {} } = {}, loading, error }) => {
          if (error) return <ErrorCard error={error} />;

          // const hasMedia = !!get(node, 'videos.[0].sources[0]', null);
          // const labelText = get(node, 'parentChannel.name', null);

          return (
            <Component
              title={title}
              summary={summary}
              coverImage={coverImage}
              // hasAction={hasMedia}
              // labelText={labelText}
              isLoading={loading}
              {...otherProps}
            />
          );
        }}
      </Query>
    );
  }
);

SearchCardConnected.propTypes = {
  Component: PropTypes.func,
  contentId: PropTypes.string,
  coverImage: PropTypes.shape({}),
  isLoading: PropTypes.bool,
  summary: PropTypes.string,
  title: PropTypes.string,
};

SearchCardConnected.defaultProps = {
  Component: searchCardComponentMapper,
};

SearchCardConnected.displayName = 'SearchCardConnected';

export default SearchCardConnected;
