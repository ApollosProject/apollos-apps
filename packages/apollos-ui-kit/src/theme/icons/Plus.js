import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      fill={fill}
      d="M17.7 11.7h-5.4V6.3a.3.3 0 00-.6 0v5.4H6.3a.3.3 0 000 .6h5.4v5.4a.3.3 0 00.6 0v-5.4h5.4a.3.3 0 000-.6z"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
