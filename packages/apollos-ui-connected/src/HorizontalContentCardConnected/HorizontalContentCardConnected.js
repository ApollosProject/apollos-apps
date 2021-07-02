import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { HorizontalDefaultCard } from '@apollosproject/ui-kit';

import ContentCardConnected from '../ContentCardConnected';

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
  Component: HorizontalDefaultCard,
};

HorizontalContentCardConnected.displayName = 'HorizontalContentCardConnected';

export default HorizontalContentCardConnected;
