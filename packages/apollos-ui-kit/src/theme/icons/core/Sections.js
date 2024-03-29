import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="M2.4,2.4 L2.4,8.4 L8.4,8.4 L8.4,2.4 L2.4,2.4 Z M1.2,0 L9.6,0 C10.2627417,0 10.8,0.5372583 10.8,1.2 L10.8,9.6 C10.8,10.2627417 10.2627417,10.8 9.6,10.8 L1.2,10.8 C0.5372583,10.8 0,10.2627417 0,9.6 L0,1.2 C0,0.5372583 0.5372583,0 1.2,0 Z M14.4,0 L22.8,0 C23.4627417,0 24,0.5372583 24,1.2 L24,9.6 C24,10.2627417 23.4627417,10.8 22.8,10.8 L14.4,10.8 C13.7372583,10.8 13.2,10.2627417 13.2,9.6 L13.2,1.2 C13.2,0.5372583 13.7372583,0 14.4,0 Z M15.6,2.4 L15.6,8.4 L21.6,8.4 L21.6,2.4 L15.6,2.4 Z M14.4,13.2 L22.8,13.2 C23.4627417,13.2 24,13.7372583 24,14.4 L24,22.8 C24,23.4627417 23.4627417,24 22.8,24 L14.4,24 C13.7372583,24 13.2,23.4627417 13.2,22.8 L13.2,14.4 C13.2,13.7372583 13.7372583,13.2 14.4,13.2 Z M15.6,15.6 L15.6,21.6 L21.6,21.6 L21.6,15.6 L15.6,15.6 Z M1.2,13.2 L9.6,13.2 C10.2627417,13.2 10.8,13.7372583 10.8,14.4 L10.8,22.8 C10.8,23.4627417 10.2627417,24 9.6,24 L1.2,24 C0.5372583,24 0,23.4627417 0,22.8 L0,14.4 C0,13.7372583 0.5372583,13.2 1.2,13.2 Z M2.4,15.6 L2.4,21.6 L8.4,21.6 L8.4,15.6 L2.4,15.6 Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
