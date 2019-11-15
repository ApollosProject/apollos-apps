import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import Marker from './Marker';

const region = {
  latitude: 39.809734,
  longitude: -98.555618,
};

const styles = { opacity: 0.35 };

storiesOf('ui-mapview/Marker', module).add('default', () => (
  <Marker
    latitude={region.latitude}
    longitude={region.longitude}
    onPress={() => {}}
    opacityStyle={styles}
  />
));
