// experimental
import React, { useMemo } from 'react';
import {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import PropTypes from 'prop-types';

import FlexedView from '../FlexedView';
import Stretchy from './ReanimatedStretchy';

const StretchyView = ({ children, scrollY: scrollYProp }) => {
  let scrollY = useSharedValue(0);
  if (scrollYProp) {
    scrollY = scrollYProp;
  }

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const renderStretchy = useMemo(
    // eslint-disable-next-line react/display-name
    () => (props) => <Stretchy {...props} scrollY={scrollY} />,
    [scrollY]
  );

  return (
    <FlexedView>
      {children({
        scrollEventThrottle: 16,
        onScroll,
        Stretchy: renderStretchy,
      })}
    </FlexedView>
  );
};

StretchyView.propTypes = {
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  scrollY: PropTypes.shape({
    value: PropTypes.number,
  }),
};

export default StretchyView;
