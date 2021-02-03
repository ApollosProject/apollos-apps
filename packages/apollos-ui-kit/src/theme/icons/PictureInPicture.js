import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="M3.75073 5.125C3.6817 5.125 3.62573 5.18096 3.62573 5.25V18.75C3.62573 18.819 3.6817 18.875 3.75073 18.875H20.2507C20.3198 18.875 20.3757 18.819 20.3757 18.75V5.25C20.3757 5.18096 20.3198 5.125 20.2507 5.125H3.75073ZM2.37573 5.25C2.37573 4.49061 2.99134 3.875 3.75073 3.875H20.2507C21.0101 3.875 21.6257 4.49061 21.6257 5.25V18.75C21.6257 19.5094 21.0101 20.125 20.2507 20.125H3.75073C2.99134 20.125 2.37573 19.5094 2.37573 18.75V5.25Z"
      fill={fill}
    />
    <Path
      d="M10 12.7C10 12.5895 10.0895 12.5 10.2 12.5H18.6889C18.7993 12.5 18.8889 12.5895 18.8889 12.7V17.3C18.8889 17.4105 18.7993 17.5 18.6889 17.5H10.2C10.0895 17.5 10 17.4105 10 17.3V12.7Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
