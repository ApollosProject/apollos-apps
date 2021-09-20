import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Line, Polyline } from 'react-native-svg';

import makeIcon from '../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" {...otherProps}>
    <Line
      x1="64"
      y1="64"
      x2="192"
      y2="192"
      fill="none"
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={size}
    />
    <Polyline
      points="88 192 192 192 192 88"
      fill="none"
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={size}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
