import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 26" {...otherProps}>
    <Path
      fill={fill}
      d="M19.3 12.5h-6.8V5.7a.4.4 0 00-.8 0v6.8H4.9a.4.4 0 000 .8h6.8v6.8a.4.4 0 00.8 0v-6.8h6.8a.4.4 0 000-.8z"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
