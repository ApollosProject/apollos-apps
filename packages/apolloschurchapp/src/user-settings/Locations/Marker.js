import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Marker from 'react-native-maps';

import { UIText } from '@apollosproject/ui-kit';

import markerDot from './markerDot.png';

class StyledMarker extends PureComponent {
  static propTypes = {
    latitude: PropTypes.string,
    longitude: PropTypes.string,
    Name: PropTypes.string,
  };

  render() {
    return (
      <Marker
        coordinate={{
          latitude: this.props.latitude,
          longitude: this.props.longitude,
        }}
        anchor={{ x: 0.69, y: 1 }}
        image={markerDot}
      >
        <UIText>{this.props.Name}</UIText>
      </Marker>
    );
  }
}

export default StyledMarker;
