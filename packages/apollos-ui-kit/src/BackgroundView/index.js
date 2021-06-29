import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { View } from 'react-native';

import { useTheme } from '../theme';

const BackgroundView = ({
  material = 'screen',
  flexed = true,
  style: styleProp,
  ...viewProps
}) => {
  const theme = useTheme();
  const backgroundColor =
    theme?.colors?.background[material] || theme?.colors?.background?.screen;
  const style = useMemo(
    () => [
      {
        backgroundColor,
        flex: flexed ? 1 : 0,
      },
      styleProp,
    ],
    [backgroundColor, styleProp, flexed]
  );

  return <View style={style} {...viewProps} />; // eslint-disable-line react/jsx-props-no-spreading
};

BackgroundView.propTypes = {
  material: PropTypes.string,
  flexed: PropTypes.bool,
  style: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

export default BackgroundView;
