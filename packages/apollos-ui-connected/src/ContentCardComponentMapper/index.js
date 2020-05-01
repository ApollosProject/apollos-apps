import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { withTheme } from '@apollosproject/ui-kit';

import cardMapper from './cardMapper';

const contentCardComponentMapper = memo(
  withTheme({}, 'contentCardComponentMapper')(({ Component, ...props }) => (
    <Component {...props} />
  ))
);

contentCardComponentMapper.propTypes = {
  Component: PropTypes.func,
};

contentCardComponentMapper.defaultProps = {
  Component: cardMapper,
};

contentCardComponentMapper.displayName = 'ListItemCard';

export default contentCardComponentMapper;
