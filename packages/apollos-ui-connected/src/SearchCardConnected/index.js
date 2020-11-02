import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { ContentCardComponentMapper } from '../ContentCardConnected';

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
    /* We don't have a way to know for certain if a particular card is true for `hasAction` without
     * hitting Rock. While not 100% perfect we do know that these two types will have almost always
     * have media associated with them.

     * TODO: refactor this logic to where this component is used and delete it entirely. We can now
     * use ContentCardComponentMapper directly as a component.
     */
    const hasAction = ['MediaContentItem', 'WeekendContentItem'].includes(
      get(node, '__typename')
    );

    return (
      <Component
        coverImage={get(coverImage, 'sources', undefined)}
        hasAction={hasAction}
        isLoading={isLoading}
        summary={summary}
        title={title}
        {...otherProps}
        {...node}
      />
    );
  }
);

SearchCardConnected.propTypes = {
  Component: PropTypes.func,
  coverImage: PropTypes.shape({
    /* eslint-disable-next-line */
    sources: PropTypes.array,
  }),
  summary: PropTypes.string,
  title: PropTypes.string,
  node: PropTypes.shape({}),
  isLoading: PropTypes.bool,
};

SearchCardConnected.defaultProps = {
  Component: ContentCardComponentMapper,
};

SearchCardConnected.displayName = 'SearchCardConnected';

export default SearchCardConnected;
