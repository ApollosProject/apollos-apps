import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" {...otherProps}>
    <Path
      fill={fill}
      fillOpacity=".1"
      d="M24 0a24 24 0 1 0 0 48 24 24 0 0 0 0-48z"
    />
    <Path
      fill={fill}
      d="M20 15.3c0-1.3.9-1.7 2-1l11 8c1.1.8 1.1 2 0 2.8l-11 8.4c-1.1.9-2 .5-2-.8V15.3z"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
