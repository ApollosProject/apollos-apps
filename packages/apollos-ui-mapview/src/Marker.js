import React, { memo } from 'react';
import { View, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { Marker as DefaultMarker } from 'react-native-maps';
import Color from 'color';

import styled from '@apollosproject/ui-kit/src/styled';

const MarkerView = styled(
  ({ theme }) => ({
    width: theme.sizing.baseUnit / 2, // 8
    height: theme.sizing.baseUnit / 2, // 8
    borderRadius: theme.sizing.baseUnit / 4, // 4
    backgroundColor: Color(theme.colors.primary).fade(theme.alpha.medium),
    zIndex: 2,
  }),
  'ui-mapview.Marker.MarkerView'
)(View);

const MarkerRingView = styled(
  ({ theme }) => ({
    width: theme.sizing.baseUnit / 1.5, // 24
    height: theme.sizing.baseUnit / 1.5, // 24
    borderRadius: theme.sizing.baseUnit - 4, // 12
    backgroundColor: Color(theme.colors.primary).fade(theme.alpha.low),
    borderWidth: 1,
    borderColor: Color(theme.colors.primary).fade(theme.alpha.medium),
    alignItems: 'center',
    justifyContent: 'center',
  }),
  'ui-mapview.Marker.MarkerRingView'
)(View);

const Marker = memo(({ latitude, longitude, opacityStyle, onPress }) => (
  <DefaultMarker onPress={onPress} coordinate={{ latitude, longitude }}>
    <Animated.View style={opacityStyle}>
      <MarkerRingView>
        <MarkerView />
      </MarkerRingView>
    </Animated.View>
  </DefaultMarker>
));

Marker.displayName = 'Marker';

Marker.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  opacityStyle: PropTypes.shape({}),
};

export default Marker;
