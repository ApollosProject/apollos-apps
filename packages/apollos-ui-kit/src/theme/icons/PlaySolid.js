import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" {...otherProps}>
    <Path
      d="M24 0a24 24 0 1 1 0 48 24 24 0 0 1 0-48zm9.2 25.5c.5-.4.8-.9.8-1.4 0-.7-.3-1.2-.8-1.5l-12-8.3c-.5-.2-1.1-.2-1.7 0-.5.3-.8.9-.8 1.5v16.4a1.7 1.7 0 0 0 1.7 1.7c.3 0 .6 0 1-.2l11.8-8.2z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
