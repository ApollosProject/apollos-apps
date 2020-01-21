import React, { memo } from 'react';
import PropTypes from 'prop-types';

import ContentCardConnected from '../../../apolloschurchapp/src/ui/ContentCardConnected';

import horizontalContentCardComponentMapper from './horizontalContentCardComponentMapper';

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
  Component: horizontalContentCardComponentMapper,
};

HorizontalContentCardConnected.displayName = 'HorizontalContentCardConnected';

export default HorizontalContentCardConnected;
