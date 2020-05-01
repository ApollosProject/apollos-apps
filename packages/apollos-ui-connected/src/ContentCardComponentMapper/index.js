import React, { memo } from 'react';
import PropTypes from 'prop-types';

import cardMapper from './cardMapper';

const ContentCardComponentMapper = memo(({ Component, ...props }) => (
  <Component {...props} />
));

ContentCardComponentMapper.propTypes = {
  Component: PropTypes.func,
};

ContentCardComponentMapper.defaultProps = {
  Component: cardMapper,
};

ContentCardComponentMapper.displayName = 'ListItemCard';

export default ContentCardComponentMapper;
