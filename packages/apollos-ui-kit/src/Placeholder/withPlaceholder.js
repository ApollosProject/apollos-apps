import React from 'react';

import { getIsLoading } from '../isLoading';

import Line from './Line';

const withPlaceholder = (PlaceholderComponent = Line, getProps = {}) => (
  Component
) =>
  getIsLoading(({ isLoading = false, style, lineNumber, ...props }) => {
    const propInput =
      typeof getProps === 'function' ? getProps(props) : getProps;
    return (
      <PlaceholderComponent
        onReady={!isLoading}
        style={style}
        lineNumber={lineNumber}
        {...propInput}
      >
        <Component style={style} {...props} />
      </PlaceholderComponent>
    );
  });

export default withPlaceholder;
