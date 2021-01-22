import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../Icon/makeIcon';

const Icon = makeIcon(({ size = 16, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" {...otherProps}>
    <Path
      d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
      fill={fill}
    />
    <Path
      d="M8 5C9.10457 5 10 4.10457 10 3C10 1.89543 9.10457 1 8 1C6.89543 1 6 1.89543 6 3C6 4.10457 6.89543 5 8 5Z"
      fill={fill}
    />
    <Path
      d="M8 15C9.10457 15 10 14.1046 10 13C10 11.8954 9.10457 11 8 11C6.89543 11 6 11.8954 6 13C6 14.1046 6.89543 15 8 15Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
