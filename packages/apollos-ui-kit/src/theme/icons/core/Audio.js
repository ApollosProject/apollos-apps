import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="M3.82 13.5H2v-.32C2 6.54 5.22 2 12 2c6.5 0 9.64 4.16 9.98 10.42v1.07h-1.82v-1c-.3-5.8-3.02-8.8-8.16-8.8-5.37 0-8.18 3.32-8.18 9.45v.3zm0 1.7h1.6c.87 0 1.58.66 1.58 1.48v2.13c0 .86-.7 1.5-1.6 1.5-.87 0-1.58-.64-1.58-1.5v-3.6zm0-1.7h1.6c1.87 0 3.4 1.42 3.4 3.18v2.13c0 1.8-1.53 3.2-3.4 3.2C3.5 22 2 20.6 2 18.8v-5.3h1.82zm16.36 1.7v3.6c0 .83-.7 1.5-1.6 1.5-.87 0-1.58-.67-1.58-1.5v-2.1c0-.82.7-1.5 1.6-1.5h1.58zm0-1.7H22v5.3c0 1.77-1.53 3.2-3.4 3.2-1.9 0-3.42-1.43-3.42-3.2v-2.1c0-1.76 1.53-3.2 3.4-3.2h1.6z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
