import React, { memo } from 'react';
import PropTypes from 'prop-types';

import ContentCardConnected from '../ContentCardConnected';

import HorizontalContentCardComponentMapper from './HorizontalContentCardComponentMapper';

const HorizontalContentCardConnected = memo(
  ({ Component, isLoading, ...otherProps }) => (
    <ContentCardConnected
      Component={Component}
      isLoading={isLoading}
      {...otherProps}
    />
  )
);

HorizontalContentCardConnected.propTypes = {
  Component: PropTypes.func,
  isLoading: PropTypes.bool,
};

HorizontalContentCardConnected.defaultProps = {
  Component: HorizontalContentCardComponentMapper,
};

HorizontalContentCardConnected.displayName = 'HorizontalContentCardConnected';

export default HorizontalContentCardConnected;
