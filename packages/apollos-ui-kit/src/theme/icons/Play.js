import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="M20.0597015,13.7960954 L6.08955224,23.7223427 C5.75373134,23.9305857 5.35074627,24 5.01492537,24 C4.67910448,24 4.34328358,23.9305857 4.00746269,23.7223427 C3.40298507,23.3752711 3,22.681128 3,21.9175705 L3,2.06507592 C3,1.30151844 3.40298507,0.607375271 4.00746269,0.260303688 C4.6119403,-0.0867678959 5.41791045,-0.0867678959 6.02238806,0.260303688 L20.0597015,10.2559653 C20.6641791,10.6030369 21,11.29718 21,12.0607375 C21,12.7548807 20.6641791,13.3796095 20.0597015,13.7960954 Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
