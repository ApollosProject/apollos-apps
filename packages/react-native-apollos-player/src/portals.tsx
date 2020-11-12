import * as React from 'react';
import { requireNativeComponent } from 'react-native';

import type { PortalOriginProps, PortalDestinationProps } from './portals';

const PortalOrigin: React.FunctionComponent<PortalOriginProps> = (props) => (
  <RCTPortalOrigin {...props} />
);

const PortalDestination: React.FunctionComponent<PortalDestinationProps> = (
  props
) => <RCTPortalDestination {...props} />;

const RCTPortalOrigin = requireNativeComponent('RCTPortalOrigin');
const RCTPortalDestination = requireNativeComponent('RCTPortalDestination');

export { PortalOrigin, PortalDestination };
