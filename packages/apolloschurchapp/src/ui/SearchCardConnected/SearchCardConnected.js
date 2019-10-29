import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import searchCardComponentMapper from './searchCardComponentMapper';

const SearchCardConnected = memo(
  ({ Component, data, isLoading, ...otherProps }) => {
    const typename = get(data, 'node.id', '').split(':')[0];
    const hasMedia = () => {
      switch (typename) {
        case 'MediaContentItem':
        case 'WeekendContentItem':
          return true;
        default:
          return false;
      }
    };

    console.log(data);

    return (
      <Component
        title={get(data, 'title', '')}
        summary={get(data, 'summary', '')}
        coverImage={get(data, 'coverImage.sources', {})}
        hasAction={hasMedia}
        isLoading={isLoading}
        __typename={typename}
        id={get(data, 'node.id', null)}
        {...otherProps}
      />
    );
  }
);

SearchCardConnected.propTypes = {
  Component: PropTypes.func,
  data: PropTypes.shape({
    summary: PropTypes.string,
    title: PropTypes.string,
    coverImage: PropTypes.shape({}),
    node: PropTypes.shape({}),
  }),
  isLoading: PropTypes.bool,
};

SearchCardConnected.defaultProps = {
  Component: searchCardComponentMapper,
};

SearchCardConnected.displayName = 'SearchCardConnected';

export default SearchCardConnected;
