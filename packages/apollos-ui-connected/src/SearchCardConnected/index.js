import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { ContentCard } from '@apollosproject/ui-kit';

const SearchCardConnected = memo(
  ({ Component, isLoading, node, ...otherProps }) => {
    /* We don't have a way to know for certain if a particular card is true for `hasAction` without
     * hitting Rock. While not 100% perfect we do know that these two types will have almost always
     * have media associated with them. */
    const hasAction = ['MediaContentItem', 'WeekendContentItem'].includes(
      get(node, '__typename')
    );

    return (
      <Component
        hasAction={hasAction}
        isLoading={isLoading}
        {...otherProps}
        {...node}
      />
    );
  }
);

SearchCardConnected.propTypes = {
  Component: PropTypes.func,
  coverImage: PropTypes.shape({
    sources: PropTypes.array,
  }),
  summary: PropTypes.string,
  title: PropTypes.string,
  node: PropTypes.shape({ id: PropTypes.string, __typename: PropTypes.string }),
  isLoading: PropTypes.bool,
};

SearchCardConnected.defaultProps = {
  Component: ContentCard,
};

SearchCardConnected.displayName = 'SearchCardConnected';

export default SearchCardConnected;
