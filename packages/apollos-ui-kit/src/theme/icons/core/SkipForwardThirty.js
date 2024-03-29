import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="M15.39 3.24c.12.04.23.1.31.2.2.2.25.45.2.67a.7.7 0 0 1-.24.39l-3.18 2.69-.99-1.12 3.19-2.69.28 1.26a9.56 9.56 0 0 0-7.24.66 9.07 9.07 0 0 0-2.27 14.37 9.47 9.47 0 0 0 8.96 2.57 8.98 8.98 0 0 0 6.6-6.31c.1-.4.52-.62.92-.5.4.1.63.5.52.9-1 3.63-3.93 6.43-7.66 7.33a11 11 0 0 1-10.4-2.98A10.5 10.5 0 0 1 7 4c1.89-1 4.04-1.41 6.17-1.2L11.8 1.25a.72.72 0 0 1 .07-1.03.76.76 0 0 1 1.06.08l2.76 3.12c.18.18.25.43.2.67a.73.73 0 0 1-.24.4l-3.18 2.69c-.75.63-1.74-.48-.99-1.12l3.19-2.69-.07 1.03-1.43-1.6c.74.06 1.48.2 2.2.43zm-3.93 10.82c.39.64.4 1.43 0 2.07a2.23 2.23 0 0 1-1.9 1.05H8.6c-1.04 0-1.89-.8-1.89-1.78 0-.33.28-.6.63-.6s.63.27.63.6c0 .32.28.59.63.59h.95c.34 0 .65-.17.82-.45a.84.84 0 0 0 0-.89.96.96 0 0 0-.82-.44c-.83 0-.85-1.17-.02-1.18.52-.01.93-.4.93-.9 0-.47-.41-.87-.9-.88H8.6c-.35 0-.63.26-.63.6 0 .32-.28.59-.63.59s-.63-.27-.63-.6c0-.98.85-1.78 1.9-1.78h.96c1.2.03 2.15.95 2.15 2.08 0 .57-.25 1.09-.65 1.46.15.13.28.29.39.46zm5.22 2.8c-.78.43-1.74.43-2.52 0a2.35 2.35 0 0 1-1.26-2.05v-2.37c0-1.32 1.13-2.38 2.52-2.38 1.4 0 2.52 1.06 2.52 2.38v2.37c0 .85-.48 1.63-1.26 2.05zm0-4.42c0-.66-.56-1.2-1.26-1.2s-1.26.54-1.26 1.2v2.37c0 .42.24.82.63 1.03.4.2.87.2 1.26 0 .4-.21.63-.6.63-1.03v-2.37z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
