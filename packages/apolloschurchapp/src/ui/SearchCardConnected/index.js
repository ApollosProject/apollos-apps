import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import searchCardComponentMapper from './searchCardComponentMapper';

const SearchCardConnected = memo(
  ({
    Component,
    coverImage,
    isLoading,
    node,
    summary,
    title,
    ...otherProps
  }) => {
    /* `id` is the only value we pull from the `node` and it is server optimized to not hit Rock. We
     * need the `id for navigation but also use it to grab the `typename` so we don't have to hit
     * Rock for that either. */
    const typename = get(node, 'id', '').split(':')[0];
    const hasAction = () => {
      switch (typename) {
        case 'MediaContentItem':
        case 'WeekendContentItem':
          return true;
        default:
          return false;
      }
    };

    return (
      <Component
        coverImage={get(coverImage, 'sources', [])}
        hasAction={hasAction}
        isLoading={isLoading}
        summary={summary}
        title={title}
        {...otherProps}
        __typename={typename} // we want to explicitly make sure we override any `typename` that might come from `otherProps`
      />
    );
  }
);

SearchCardConnected.propTypes = {
  Component: PropTypes.func,
  coverImage: PropTypes.shape({}),
  summary: PropTypes.string,
  title: PropTypes.string,
  node: PropTypes.shape({}),
  isLoading: PropTypes.bool,
};

SearchCardConnected.defaultProps = {
  Component: searchCardComponentMapper,
};

SearchCardConnected.displayName = 'SearchCardConnected';

export default SearchCardConnected;
