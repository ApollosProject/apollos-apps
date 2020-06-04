import React from 'react';
import PropTypes from 'prop-types';

import { withTheme } from '@apollosproject/ui-kit';

import cardMapper from './cardMapper';

const ContentCardComponentMapper = ({ Component, ...props }) => (
  <Component {...props} />
);

ContentCardComponentMapper.propTypes = {
  Component: PropTypes.func,
};

ContentCardComponentMapper.defaultProps = {
  Component: cardMapper,
};

ContentCardComponentMapper.displayName = 'ListItemCard';

const ContentCardComponentMapperWithTheme = withTheme(
  () => ({}),
  'ui-connected.ContentCardComponentMapper'
)(ContentCardComponentMapper);

export default ContentCardComponentMapperWithTheme;
