import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import makeIcon from '../../../Icon/makeIcon';

const Icon = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
    <Path
      d="M19.7793 10.4688L6.28223 2.22027C6.05488 2.08125 5.79461 2.00531 5.52817 2.00027C5.26174 1.99523 4.99878 2.06126 4.76634 2.19158C4.5339 2.3219 4.34038 2.51179 4.20568 2.74173C4.07099 2.97166 4 3.23333 4 3.49981V19.9983C4.00022 20.2647 4.07135 20.5263 4.20609 20.7561C4.34083 20.9859 4.53433 21.1757 4.76669 21.3059C4.99906 21.4362 5.26192 21.5023 5.52826 21.4974C5.79461 21.4924 6.05484 21.4167 6.28223 21.2779L19.7793 13.0294C19.9986 12.8953 20.1797 12.7071 20.3054 12.483C20.4311 12.2588 20.4971 12.0061 20.4971 11.7491C20.4971 11.4921 20.4311 11.2394 20.3054 11.0152C20.1797 10.791 19.9986 10.6029 19.7793 10.4688V10.4688Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
