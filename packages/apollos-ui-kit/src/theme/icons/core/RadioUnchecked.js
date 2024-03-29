import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="M12 24C5.37 24 0 18.63 0 12S5.37 0 12 0s12 5.37 12 12-5.37 12-12 12zm0-2.4c5.3 0 9.6-4.3 9.6-9.6S17.3 2.4 12 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
