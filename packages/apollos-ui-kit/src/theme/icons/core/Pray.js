import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Circle, Path } from 'react-native-svg';

import makeIcon from '../../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Circle
      className="a"
      cx="11.75"
      cy="4.168"
      r="2.625"
      fill="none"
      stroke={fill}
      strokeWidth={2}
    />
    <Path
      d="M19.25,21.043a1.5,1.5,0,0,1-1.5,1.5h-9a1.5,1.5,0,0,1-.806-2.766l7.223-4.6-1.135-3.03-2.528,1.8a3.007,3.007,0,0,1-4.047-.521L4.6,10A1.5,1.5,0,1,1,6.9,8.082l2.859,3.43,4.116-2.94a1.5,1.5,0,0,1,2.277.7l1.822,4.86a3.014,3.014,0,0,1-1.2,3.585L13.9,19.543h3.85A1.5,1.5,0,0,1,19.25,21.043Z"
      fill={'none'}
      stroke={fill}
      strokeWidth={2}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
