import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../Icon/makeIcon';

const Icon = makeIcon(({ size = 24, fill, ...otherProps } = {}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...otherProps}
    fill="none"
  >
    <Path
      d="M2.99951 9.75H7.49951V19.5H2.99951C2.8006 19.5 2.60983 19.421 2.46918 19.2803C2.32853 19.1397 2.24951 18.9489 2.24951 18.75V10.5C2.24951 10.3011 2.32853 10.1103 2.46918 9.96967C2.60983 9.82902 2.8006 9.75 2.99951 9.75V9.75Z"
      stroke={fill}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.49951 9.75L11.2495 2.25C11.6435 2.25 12.0336 2.3276 12.3976 2.47836C12.7615 2.62913 13.0923 2.8501 13.3708 3.12868C13.6494 3.40726 13.8704 3.73797 14.0212 4.10195C14.1719 4.46593 14.2495 4.85603 14.2495 5.25V7.5H20.0503C20.263 7.5 20.4733 7.54523 20.6672 7.63269C20.861 7.72016 21.0341 7.84785 21.1749 8.0073C21.3156 8.16675 21.4209 8.35431 21.4836 8.55753C21.5463 8.76076 21.5651 8.975 21.5388 9.18605L20.4138 18.1861C20.3684 18.5488 20.1921 18.8826 19.918 19.1245C19.644 19.3665 19.2909 19.5 18.9253 19.5H7.49951"
      stroke={fill}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
