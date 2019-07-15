import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="m6,3.34c0,-1.3 0.88,-1.73 1.97,-0.95l11.05,7.9c1.1,0.8 1.1,2.06 0.04,2.86l-11.13,8.4c-1.07,0.85 -1.93,0.45 -1.93,-0.85l0,-17.36z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
