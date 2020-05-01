import React, { memo } from 'react';
import PropTypes from 'prop-types';

import listItemCardMapper from './listItemCardMapper';

const ListItemCard = memo(({ Component, ...props }) => (
  <Component {...props} />
));

ListItemCard.propTypes = {
  Component: PropTypes.func,
};

ListItemCard.defaultProps = {
  Component: listItemCardMapper,
};

ListItemCard.displayName = 'ListItemCard';

export default ListItemCard;
