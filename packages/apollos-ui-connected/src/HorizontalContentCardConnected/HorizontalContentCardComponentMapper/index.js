import React from 'react';
import PropTypes from 'prop-types';

import { withTheme } from '@apollosproject/ui-kit';

import cardMapper from './cardMapper';

const HorizontalContentCardComponentMapper = withTheme(
  () => ({}),
  'ui-connected.HorizontalContentCardConnected.HorizontalContentCardComponentMapper'
)(({ Component, ...props }) => <Component {...props} />);

HorizontalContentCardComponentMapper.propTypes = {
  Component: PropTypes.func,
};

HorizontalContentCardComponentMapper.defaultProps = {
  Component: cardMapper,
};

HorizontalContentCardComponentMapper.displayName = 'ListItemCard';

export default HorizontalContentCardComponentMapper;
